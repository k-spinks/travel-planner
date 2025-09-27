"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

export default async function deleteTrip(tripId: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  if (!tripId) {
    throw new Error("Trip does not exist");
  }

  await prisma.trip.delete({
    where: {
      id: tripId,
    },
  });
}
