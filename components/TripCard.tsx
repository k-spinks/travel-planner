import { Trip } from "@/app/generated/prisma";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function TripCard({ tripInfo }: { tripInfo: Trip }) {
  return (
    <Link
      href={`/trips/${tripInfo.id}`}
      className="group relative block min-w-[250px] h-64 w-full rounded-xl overflow-hidden shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: `url(${tripInfo.imageUrl || "/default-earth.png"})`,
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content container */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-12">
        <h1 className="text-2xl font-semibold">{tripInfo.title}</h1>
        <div className="flex items-center mt-1">
          <Calendar className="h-5 w-5 mr-2" />
          <span className="text-sm">
            {tripInfo.startDate.toLocaleDateString()} –{" "}
            {tripInfo.endDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Hidden description */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white opacity-0 translate-y-6 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
        <p className="text-sm">{tripInfo.description}</p>
      </div>
    </Link>
  );
}
