"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function geocodeAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();

  console.log("Geocode response:", JSON.stringify(data, null, 2)); // log in Vercel

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      "Google Maps API request denied. Check API key and restrictions."
    );
  }

  if (data.status === "ZERO_RESULTS" || !data.results?.length) {
    throw new Error("Invalid location. Please enter a valid address.");
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
    return { success: false, error: "Missing address" };
  }

  try {
    const { lat, lng } = await geocodeAddress(address);

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

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add location." };
  }
}
