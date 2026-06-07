import Link from "next/link";
import { Button } from "antd";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
    event: any;
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200/70 flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden group cursor-pointer">
                <img
                    src={event.image || "https://placehold.co/600x400"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md backdrop-blur-md ${event.isPremium ? 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white' : 'bg-green-500/90 text-white'}`}>
                        {event.isPremium ? "Premium" : "Free"}
                    </span>
                </div>
                {event.categoryId?.name && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-black/60 text-white backdrop-blur-md text-xs font-semibold rounded-full">
                            {event.categoryId.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="truncate">{event.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                        {event.isPremium ? `$${event.price}` : "Free"}
                    </div>
                    <Link href={`/events/${event._id}`}>
                        <Button type="primary" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 shadow-md shadow-blue-500/30 font-semibold border-none">
                            Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
