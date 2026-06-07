"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import EventCard from "../../reuseable/event-card";



export default function TrendingEvents() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [eventsRes] = await Promise.all([
                    api.get("/events?limit=10"),
                ]);
                setEvents(eventsRes.data.data.results || []);
            } catch (error: any) {
                console.error("Failed to load home data", error);
            }
        };
        fetchHomeData();
    }, []);


    const trendingEvents = [...events]
        .sort((a, b) => (b.bookings || 0) - (a.bookings || 0))
        .slice(0, 3);


    return (
        <section>
            {trendingEvents.length > 0 && (
                <section className="bg-white py-14 mt-14 border-t border-b border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                                <TrendingUp className="w-6 h-6 text-rose-500" /> Trending Now
                            </h2>
                            <Link
                                href="/events"
                                className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingEvents.map((event, i) => (
                                <div key={event._id} className="relative">
                                    {i === 0 && (
                                        <span className="absolute -top-2 -left-2 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                            🔥 Hot
                                        </span>
                                    )}
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </section>
    );
}