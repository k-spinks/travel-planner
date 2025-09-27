"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

export async function deleteLocation(locationId: string, tripId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.location.delete({
    where: { id: locationId },
  });

  // refresh the itinerary page so UI updates
  revalidatePath(`/trips/${tripId}`);
}
