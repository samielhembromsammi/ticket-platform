"use client";

import { Calendar, Users, MapPin, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// AnimatedCounter component moved outside StatsBar to maintain stable identity across renders
function AnimatedCounter({
    end,
    suffix = "",
}: {
    end: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let start = 0;
                const step = Math.ceil(end / 60);
                const id = setInterval(() => {
                    start += step;
                    if (start >= end) {
                        setCount(end);
                        clearInterval(id);
                    } else setCount(start);
                }, 20);
            },
            { threshold: 0.3 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);
    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

export function StatsBar() {
    return (
        <section className="bg-blue-500 backdrop-blur-md text-white py-12 shadow-sm border-t border-blue-500/20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        {
                            icon: <Calendar className="w-5 h-5" />,
                            value: 1200,
                            suffix: "+",
                            label: "Events Listed",
                        },
                        {
                            icon: <Users className="w-5 h-5" />,
                            value: 85000,
                            suffix: "+",
                            label: "Happy Attendees",
                        },
                        {
                            icon: <MapPin className="w-5 h-5" />,
                            value: 50,
                            suffix: "+",
                            label: "Cities Covered",
                        },
                        {
                            icon: <Shield className="w-5 h-5" />,
                            value: 100,
                            suffix: "%",
                            label: "Secure Payments",
                        },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="opacity-80 mb-1">{stat.icon}</div>
                            <div className="text-3xl font-extrabold">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-blue-100 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
} 