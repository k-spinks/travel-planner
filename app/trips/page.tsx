import { auth } from "@/auth";
import TripsGrid from "@/components/TripsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );
  }

  return (
    <div className="space-y-10 container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between space-y-6 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome back, {session.user?.name}
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            {trips.length !== 0 &&
              `You planned ${trips.length} ${
                trips.length === 1 ? "trip" : "trips"
              }.${
                upcomingTrips.length > 0
                  ? ` ${upcomingTrips.length} upcoming.`
                  : ""
              }`}
          </p>
        </div>

        {trips.length > 0 && (
          <Link href="/trips/new" className="mt-2 lg:mt-0">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white shadow-md">
              <Plus className="h-5 w-5" />
              New Trip
            </Button>
          </Link>
        )}
      </div>

      {/* Trips Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Trips
        </h2>

        {trips.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                No trips yet.
              </h3>
              <p className="text-center text-gray-500 mb-6 max-w-sm">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href="/trips/new">
                <Button className="bg-blue-600 hover:bg-blue-800 hover:cursor-pointer text-white shadow">
                  Create Trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <TripsGrid trips={trips} />
        )}
      </div>
    </div>
  );
}
