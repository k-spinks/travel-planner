import { Location } from "@/app/generated/prisma";
import { closestCenter, DragEndEvent, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import { GripHorizontal, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { deleteLocation } from "@/lib/actions/delete-location";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({
  item,
  onDelete,
}: {
  item: Location;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-3 text-gray-400 hover:text-gray-600"
      >
        <GripHorizontal className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <h4 className="font-md text-gray-800">{item.locationTitle}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">{`Latitude: ${item.lat}, Longitude: ${item.lng}`}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Day {item.order}</div>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 rounded hover:cursor-pointer"
        >
          <Trash2 className="w-5 h-5" color="red" />
        </button>
      </div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocation, setLocalLocation] = useState(locations);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = localLocation.findIndex((item) => item.id === active.id);
      const newIndex = localLocation.findIndex((item) => item.id === over.id);

      const newLocationsOrder = arrayMove(
        localLocation,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setLocalLocation(newLocationsOrder);

      await reorderItinerary(
        tripId,
        newLocationsOrder.map((item) => item.id)
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    // delete from DB + trigger revalidation
    await deleteLocation(deleteTarget.id, tripId);

    // also update local state for instant feedback
    const updated = localLocation.filter((item) => item.id !== deleteTarget.id);
    const reOrdered = updated.map((item, index) => ({ ...item, order: index }));

    setLocalLocation(reOrdered);
    setDeleteTarget(null);

    // keep DB in sync with new order
    await reorderItinerary(
      tripId,
      reOrdered.map((item) => item.id)
    );
  };

  return (
    <>
      <DndContext
        id={id}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localLocation.map((location) => location.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {localLocation.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.locationTitle || ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
