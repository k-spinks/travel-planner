//app/trips/[tripId]/page.tsx

import { auth } from "@/auth";
import TripDetailClient from "@/components/trip-details";
import { prisma } from "@/lib/prisma";

export default async function TripDetail({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth();
  if (!session) {
    return <div>Please sign in.</div>;
  }
  const { tripId } = await params;

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return <TripDetailClient trip={trip} />;
}
