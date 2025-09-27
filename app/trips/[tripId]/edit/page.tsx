import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UpdateTripClient from "@/components/update-trip";

export default async function EditTripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const session = await auth();
  if (!session) {
    return <div>Please sign in.</div>;
  }

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, userId: session.user?.id },
  });

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return <UpdateTripClient trip={trip} />;
}
