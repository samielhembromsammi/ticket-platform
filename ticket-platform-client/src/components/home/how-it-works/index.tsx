"use client";

import { Search, Star, Ticket } from "lucide-react";


const HOW_IT_WORKS = [
    {
        icon: <Search className="w-6 h-6" />,
        title: "Discover",
        desc: "Browse thousands of events by category, date, or location.",
    },
    {
        icon: <Ticket className="w-6 h-6" />,
        title: "Book",
        desc: "Select your seats, pay securely, and get instant e-tickets.",
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: "Experience",
        desc: "Enjoy the event and share your memories with the community.",
    },
];


export function HowItWorks() {
    return (
        <section className="container mx-auto px-6 pt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
                How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {HOW_IT_WORKS.map((step, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-7 border border-gray-100 text-center transition group"
                    >
                        <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                            <div className="text-blue-600 group-hover:text-white transition-colors">
                                {step.icon}
                            </div>
                        </div>
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                            Step {i + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {step.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}