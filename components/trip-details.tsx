"use client";

import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "@/components/Map";
import SortableItinerary from "./SortableItinerary";
import deleteTrip from "@/lib/actions/delete-trip";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteTrip(trip.id);
      setIsDeleteModalOpen(false);
      toast.success("Trip deleted");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="w-full max-w-lg mb-4 flex justify-start ">
        <button
          type="button"
          onClick={() => router.push("/trips")}
          className="flex items-center text-gray-700 hover:text-gray-900 font-medium hover:cursor-pointer"
        >
          <span className="mr-2 text-xl">&#8592;</span> Back to Trips
        </button>
      </div>
      {/* Trip Image */}
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative">
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6 flex flex-col items-center space-y-4 lg:flex-row lg:items-center lg:justify-between relative">
          {/* Title & Dates */}
          <div className="flex flex-col items-center text-center lg:text-left flex-1 lg:ml-26">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {trip.title}
            </h1>
            <div className="flex items-center text-gray-500 mt-2">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-lg">
                {trip.startDate.toLocaleDateString()} -{" "}
                {trip.endDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Right-aligned Add Location button */}
          <div className="mt-4 lg:mr-6 flex justify-center lg:justify-end">
            <Link href={`/trips/${trip.id}/itinerary/new`}>
              <Button className="flex items-center justify-center bg-green-500 hover:bg-green-700 hover:cursor-pointer">
                <Plus className="mr-2 h-5 w-5" /> Add Location
              </Button>
            </Link>
          </div>

          {/* Pencil icon for edit */}
          <Link
            href={`/trips/${trip.id}/edit`}
            className="absolute top-4 right-4 lg:top-2 lg:right-2 text-gray-500 hover:text-gray-800"
          >
            <Pencil className="h-6 w-6" />
          </Link>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger
              value="overview"
              className="text-lg hover:cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="itinerary"
              className="text-lg hover:cursor-pointer"
            >
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg hover:cursor-pointer">
              Map
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column: Description & Trip Summary */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round(
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} day(s)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p>Destinations</p>
                      <p>
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "Location" : "Locations"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-12">
                  <p className="text-gray-600 leading-relaxed">
                    {trip.description}
                  </p>
                </div>
              </div>

              {/* Right column: Map + Add Location Button */}
              <div className="flex flex-col">
                <div className="h-72 rounded-lg overflow-hidden shadow">
                  <Map itineraries={trip.locations} />
                </div>

                {trip.locations.length === 0 && (
                  <div className="text-gray-400 text-sm mt-4">
                    <p className="text-center md:text-left">
                      Add Locations to see them on the map
                    </p>
                    <div className="flex justify-center md:justify-start mt-2">
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Button className="flex items-center justify-center bg-green-500 hover:bg-green-700 hover:cursor-pointer">
                          <Plus className="mr-2 h-5 w-5" /> Add Location
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Itinerary */}
          <TabsContent
            value="itinerary"
            className="space-y-6 hover:cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Full Itinerary</h2>
            </div>
            {trip.locations.length === 0 ? (
              <div className="text-center p-4">
                <p className="mb-4">
                  Add Locations to see them on the itinerary
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="bg-green-500 hover:bg-green-700 hover:cursor-pointer">
                    <Plus className="mr-2 h-5 w-5" /> Add Location
                  </Button>
                </Link>
              </div>
            ) : (
              <SortableItinerary locations={trip.locations} tripId={trip.id} />
            )}
          </TabsContent>

          {/* Map */}
          <TabsContent value="map" className="space-y-2">
            <div className="h-72 rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="text-gray-400 text-sm">
                <p className="text-center">
                  Add Locations to see them on the map
                </p>
                <div className="flex justify-center mt-2">
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="flex items-center justify-center bg-green-500 hover:bg-green-700 hover:cursor-pointer">
                      <Plus className="mr-2 h-5 w-5" /> Add Location
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete trip button */}
      <div className="text-center">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-sm underline text-red-400 hover:text-red-800 hover:cursor-pointer"
        >
          Delete trip
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>

          {/* Modal */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative z-10 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center hover:cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
