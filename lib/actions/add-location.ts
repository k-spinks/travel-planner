"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

async function geoCodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null; // return null for invalid address
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    return { success: false, error: "Missing Address" };
  }

  try {
    const geo = await geoCodeAddress(address);

    if (!geo) {
      return {
        success: false,
        error: "Invalid location. Please enter a valid address.",
      };
    }

    const count = await prisma.location.count({ where: { tripId } });

    await prisma.location.create({
      data: {
        locationTitle: address,
        lat: geo.lat,
        lng: geo.lng,
        tripId,
        order: count,
      },
    });

    return { success: true }; // everything succeeded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add location." };
  }
}
