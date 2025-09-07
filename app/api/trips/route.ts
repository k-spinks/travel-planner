import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user?.id,
        },
      },
      select: {
        locationTitle: true,
        lat: true,
        lng: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(
      locations.map(async (location) => {
        const geocodeResult = await getCountryFromCoordinates(
          location.lat,
          location.lng
        );
        return {
          name: `${location.trip.title} - ${geocodeResult.formattedAddress}`,
          lat: location.lat,
          lng: location.lng,
          country: geocodeResult.country,
        };
      })
    );
    return NextResponse.json(transformedLocations);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
