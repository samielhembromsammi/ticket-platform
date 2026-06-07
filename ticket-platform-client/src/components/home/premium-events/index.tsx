"use client";

import api from "@/src/services/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "../../reuseable/event-card";


export function PremiumEvents() {
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
    const premiumEvents = events.filter((e) => e.isPremium).slice(0, 3);
    return (
        <section>
            {isEventsLoading ? (
                <div className="container mx-auto px-4">
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
                premiumEvents.length > 0 && (
                    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 to-indigo-50/40 py-16 border-t border-b border-slate-200/60">
                        <div className="absolute top-[-50px] left-[5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,rgba(99,102,241,0)_70%)] blur-2xl pointer-events-none z-0 animate-float-1" />
                        <div className="absolute bottom-[-100px] right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,rgba(59,130,246,0)_70%)] blur-2xl pointer-events-none z-0 animate-float-2" />

                        <div className="container mx-auto px-6 relative z-10">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    💎 Premium Experiences
                                </h2>
                                <Link
                                    href="/events?type=premium"
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                                >
                                    View All <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {premiumEvents.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </div>
                    </section>
                )
            )}
        </section>
    )
}