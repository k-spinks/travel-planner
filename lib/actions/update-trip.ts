"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function updateTrip({
  id,
  title,
  description,
  startDate,
  endDate,
}: {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  // Validate required fields
  if (!title) throw new Error("Title is required");
  if (!startDate || !endDate)
    throw new Error("Start and end dates are required");

  return prisma.trip.update({
    where: { id, userId: session.user.id },
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });
}
