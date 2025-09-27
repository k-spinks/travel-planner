"use client";

import { useState } from "react";
import { Trip } from "@/app/generated/prisma";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";

interface TripsGridProps {
  trips: Trip[];
}

export default function TripsGrid({ trips }: TripsGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedTrips.slice(0, visibleCount).map((trip, key) => (
          <TripCard key={key} tripInfo={trip} />
        ))}
      </div>

      {trips.length > visibleCount && (
        <div className="text-center mt-6">
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 shadow hover:cursor-pointer"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
