"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await addLocation(formData, tripId);

    if (!result.success) {
      setError(result.error); // show error if something went wrong
      return;
    }

    // successful: redirect
    window.location.href = `/trips/${tripId}`;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Add New Location</h1>
            <p className="text-lg">Where did you go?</p>
          </div>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              startTransition(() => {
                handleSubmit(formData);
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                name="address"
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 hover:cursor-pointer"
            >
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
