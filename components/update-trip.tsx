"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import updateTrip from "@/lib/actions/update-trip";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditTripFormProps {
  trip: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
  };
}

export default function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();

  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState(trip.title);
  const [description, setDescription] = useState(trip.description || "");
  const [startDate, setStartDate] = useState(
    formatDateForInput(trip.startDate)
  );
  const [endDate, setEndDate] = useState(formatDateForInput(trip.endDate));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!startDate || !endDate)
      return toast.error("Start and end dates are required");
    if (new Date(startDate) > new Date(endDate))
      return toast.error("Start date cannot be after end date");

    setLoading(true);
    try {
      await updateTrip({ id: trip.id, title, description, startDate, endDate });
      toast.success("Trip updated successfully!");
      router.push(`/trips/${trip.id}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Back to trips button */}
      <div className="w-full max-w-lg mb-4 flex justify-start ">
        <button
          type="button"
          onClick={() => router.push("/trips")}
          className="flex items-center text-gray-700 hover:text-gray-900 font-medium hover:cursor-pointer"
        >
          <span className="mr-2 text-xl">&#8592;</span> Back to Trips
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Edit Trip
        </h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Trip"}
        </Button>
      </form>
    </div>
  );
}
