"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";
import toast from "react-hot-toast";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      const result = await addLocation(formData, tripId);

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Location added successfully!");
      document.querySelector<HTMLInputElement>("input[name='address']")!.value =
        "";
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-2">
            Add New Location
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter a city or location to add it to your trip itinerary.
          </p>

          <form className="space-y-6" action={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                name="address"
                type="text"
                placeholder="Sydney Oprah House"
                required
                className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${error ? "border-red-500" : "border-gray-300"}
                `}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:cursor-pointer hover:bg-blue-700"
            >
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </div>
      </div>

      {/* Back button outside of form */}
      <div className="mt-6">
        <Button
          className="bg-gray-500 hover:bg-gray-700 hover:cursor-pointer"
          onClick={() => router.push(`/trips/${tripId}`)}
        >
          Back to Trip
        </Button>
      </div>
    </div>
  );
}
