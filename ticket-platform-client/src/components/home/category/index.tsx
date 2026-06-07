"use client";

import api from "@/src/services/api";
import {
    Ticket,
    Music,
    Trophy,
    Laugh,
    Drama,
    Palette,
    Mic,
    Sparkles,
    Star,
    ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "../../reuseable/event-card";

// Utility to get beautiful category-specific icons dynamically
const getCategoryIcon = (name: string) => {
    const key = name.toLowerCase();
    if (key.includes("music") || key.includes("concert")) {
        return <Music className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    if (key.includes("sport") || key.includes("game")) {
        return <Trophy className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    if (key.includes("comedy") || key.includes("laugh") || key.includes("show")) {
        return <Laugh className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    if (key.includes("theatre") || key.includes("drama") || key.includes("stage")) {
        return <Drama className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    if (key.includes("art") || key.includes("paint") || key.includes("creative")) {
        return <Palette className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    if (key.includes("workshop") || key.includes("seminar") || key.includes("talk")) {
        return <Mic className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
    }
    return <Sparkles className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />;
};

export default function CategorySection() {
    const [categories, setCategories] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);

    // Purely local React state tracking (does not leak to or affect browser query params)
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const categoriesRes = await api.get("/categories");
                setCategories(categoriesRes.data.data || []);
            } catch (error: any) {
                if (error.message === "Network Error") {
                    return;
                }
                console.error("Failed to load categories", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch events every time activeCategory changes from API directly
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsEventsLoading(true);
                let url = "/events";

                // Pass the exact category name as returned by the API (original casing: e.g. "Manager", "Film")
                if (activeCategory && activeCategory !== "all") {
                    url += `?category=${activeCategory}`;
                }

                const eventsRes = await api.get(url);
                setEvents(eventsRes.data.data.results || []);
            } catch (error: any) {
                if (error.message === "Network Error") {
                    return;
                }
                console.error("Failed to load events", error);
            } finally {
                setIsEventsLoading(false);
            }
        };
        fetchEvents();
    }, [activeCategory]);

    // Filter handlers (toggles local category states without pushing browser URL states)
    const handleCategoryClick = (categoryName: string) => {
        const isCurrentlySelected = activeCategory.toLowerCase() === categoryName.toLowerCase();
        setActiveCategory(isCurrentlySelected ? "all" : categoryName);
    };

    const handleAllClick = () => {
        setActiveCategory("all");
    };

    const isAllSelected = !activeCategory || activeCategory === "all";

    const featuredEvents = events.slice(0, 3);

    return (
        <section className="container mx-auto px-6 pt-14">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 tracking-tight">
                <Ticket className="w-6 h-6 text-blue-500" /> Browse by Category
            </h2>

            {isLoading ? (
                <div className="flex flex-wrap gap-3">
                    {["w-28", "w-24", "w-32", "w-20", "w-28"].map((width, idx) => (
                        <div
                            key={idx}
                            className={`${width} h-[38px] rounded-full bg-slate-200/80 animate-pulse border border-transparent`}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleAllClick}
                        className={`group flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 border cursor-pointer active:scale-95 ${isAllSelected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-xs"
                            }`}
                    >
                        <Ticket className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isAllSelected ? "text-white" : "text-blue-500"
                            }`} />
                        All Events
                    </button>

                    {categories.map((cat) => {
                        const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
                        return (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`group flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 border cursor-pointer active:scale-95 ${isSelected
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-xs"
                                    }`}
                            >
                                <span className={isSelected ? "text-white" : "text-slate-400 group-hover:text-blue-500 transition-colors duration-200"}>
                                    {getCategoryIcon(cat.name)}
                                </span>
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-10">
                {isEventsLoading ? (
                    <div>
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
                ) : featuredEvents.length > 0 ? (
                    <div className="pt-4">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 tracking-tight">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                {activeCategory && activeCategory !== "all"
                                    ? "Filtered Events"
                                    : "Featured Events"}
                            </h2>
                            <Link
                                href="/events"
                                className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                            {featuredEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Ticket className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No events found</h3>
                        <p className="text-sm text-slate-400">
                            There are no events available in this category right now.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}