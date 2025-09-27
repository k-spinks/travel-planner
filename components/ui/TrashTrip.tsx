"use client";

import deleteTrip from "@/lib/actions/delete-trip";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TrashTrip({ tripId }: { tripId: string }) {
  function handleDelete() {
    const confirmed = confirm("Are you sure");
    if (!confirmed) {
      return;
    }

    deleteTrip(tripId);
    toast.success("Trip deleted");
    return;
  }
  return <Trash2 className="ml-auto text-red-500" onClick={handleDelete} />;
}
