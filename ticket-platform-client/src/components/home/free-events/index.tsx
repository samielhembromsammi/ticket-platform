"use client";

import api from "@/src/services/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "../../reuseable/event-card";

export function FreeEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setIsEventsLoading(true);
                const [eventsRes] = await Promise.all([
                    api.get("/events?limit=10"),
                ]);
                setEvents(eventsRes.data.data.results || []);
            } catch (error: any) {
                if (error.message === "Network Error") {
                    return;
                }
                console.error("Failed to load home data", error);
            } finally {
                setIsEventsLoading(false);
            }
        };
        fetchHomeData();
    }, []);


    const freeEvents = events.filter((e) => !e.isPremium).slice(0, 3);

    return (
        <section>
            {isEventsLoading ? (
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-8 animate-pulse">
                        <div className="h-8 bg-slate-200 rounded w-48" />
                        <div className="h-5 bg-slate-200 rounded w-20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col h-full animate-pulse">
                                <div className="h-48 w-full bg-slate-200" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                                    <div className="flex items-center mb-2">
                                        <div className="w-4 h-4 bg-slate-200 rounded-full mr-2" />
                                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-4 h-4 bg-slate-200 rounded-full mr-2" />
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="h-6 bg-slate-200 rounded w-1/4" />
                                        <div className="h-8 bg-slate-200 rounded-full w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                freeEvents.length > 0 && (
                    <section className="container mx-auto px-6 pt-14">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">🆓 Free Events</h2>
                            <Link
                                href="/events?type=free"
                                className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {freeEvents.map((event: any) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    </section>
                )
            )}
        </section>
    )
}