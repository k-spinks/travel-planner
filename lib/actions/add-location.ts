"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geoCodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Address not found. Please try again.");
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();

  if (!address) {
    throw new Error("Missing Address");
  }

  try {
    const { lat, lng } = await geoCodeAddress(address);
    const count = await prisma.location.count({
      where: { tripId },
    });
    await prisma.location.create({
      data: {
        locationTitle: address,
        lat,
        lng,
        tripId,
        order: count,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Failed to add location");
  }

  redirect(`/trips/${tripId}`);
}
