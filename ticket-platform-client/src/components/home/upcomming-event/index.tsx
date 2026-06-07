"use client";

import api from "@/src/services/api";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function useCountdown(targetDate: string) {
    const calc = () => {
        const diff = new Date(targetDate).getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return time;
}

export default function UpcomingEvent() {
    const [events, setEvents] = useState<any[]>([]);


    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const eventsRes = await api.get("/events?limit=10");
                setEvents(eventsRes.data.data.results || []);
            } catch (error: any) {
                console.error("Failed to load home data", error);
            }
        };
        fetchHomeData();
    }, []);


    const upcomingEvent = events.find(
        (e: any) => e.date && new Date(e.date) > new Date(),
    );
    const countdown = useCountdown(
        upcomingEvent?.date || new Date(Date.now() + 86400000 * 7).toISOString(),
    );



    return (
        <section>
            {upcomingEvent && (
                <section className="container mx-auto px-6 pt-10">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" /> Next Event Starting In
                            </p>
                            <h3 className="text-slate-800 text-xl md:text-2xl font-bold">
                                {upcomingEvent.title}
                            </h3>
                        </div>
                        <div className="flex gap-4 text-center">
                            {[
                                { val: countdown.days, label: "Days" },
                                { val: countdown.hours, label: "Hours" },
                                { val: countdown.minutes, label: "Mins" },
                                { val: countdown.seconds, label: "Secs" },
                            ].map(({ val, label }) => (
                                <div
                                    key={label}
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-w-16 shadow-xs"
                                >
                                    <div className="text-3xl font-extrabold text-slate-800 tabular-nums">
                                        {String(val).padStart(2, "0")}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                        <Link href={`/events/${upcomingEvent._id}`}>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap shadow-md shadow-blue-200">
                                Get Tickets
                            </button>
                        </Link>
                    </div>
                </section>
            )}
        </section>
    );
}