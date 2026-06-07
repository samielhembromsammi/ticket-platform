"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/src/services/api";
import { Button, message } from "antd";
import { Calendar, MapPin, Ticket, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (id) {
      api.get(`/events/${id}`)
        .then((res) => setEvent(res.data.data))
        .catch(() => message.error("Failed to load event details"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex justify-center p-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">
    </div>
  </div>;

  if (!event) return <div className="text-center p-20">Event not found</div>;


  const isSoldOut = event.isPremium && event.soldTickets >= event.totalTickets;

  const handleAction = () => {
    // if (!isAuthenticated) {
    //   message.info("Please login to proceed");
    //   router.push("/auth/login");
    //   return;
    // }
    router.push(`/checkout?eventId=${event._id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Event Header Image */}
      <div className="w-full h-[400px] relative">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full container mx-auto px-6 pb-8">
          <span className={`px-4 py-1.5 text-sm font-bold rounded-full inline-block mb-4 ${event.isPremium ? 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white' : 'bg-green-500 text-white'}`}>
            {event.isPremium ? "Premium Event" : "Free Event"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
          <p className="text-lg text-gray-300">{event.categoryId?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3 bg-white p-8 rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">About this Event</h2>
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Sidebar / Ticket Box */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 sticky top-24">

            <div className="flex items-center text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl">
              <Calendar className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="font-semibold">Date & Time</p>
                <p className="text-sm">{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 mb-8 bg-gray-50 p-4 rounded-xl">
              <MapPin className="w-6 h-6 mr-4 text-red-500" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm">{event.location}</p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Price</span>
                <span className="text-3xl font-bold text-gray-900">{event.isPremium ? `$${event.price}` : "Free"}</span>
              </div>

              {event.isPremium && (
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span><Ticket className="w-4 h-4 inline mr-1" /> Tickets available</span>
                  <span className="font-semibold">{event.totalTickets - event.soldTickets} / {event.totalTickets}</span>
                </div>
              )}
            </div>

            {event.isPremium ? (
              <Button
                type="primary"
                size="large"
                disabled={isSoldOut}
                onClick={handleAction}
                className={`w-full h-14 text-lg font-bold rounded-xl ${isSoldOut ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500 border-none'}`}
              >
                {isSoldOut ? "Sold Out" : "Buy Ticket"}
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                className="w-full h-14 text-lg font-bold rounded-xl bg-green-600 hover:bg-green-500 border-none"
              >
                This is a Free Event (No ticket required)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
