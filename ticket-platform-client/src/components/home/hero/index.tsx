"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const carouselEvents = [
        {
            _id: "default-1",
            title: "Discover Amazing Concerts & Festivals",
            description: "Book tickets to the best concerts, live music events, and workshops in your city with premium experiences.",
            category: "Concerts",
            coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
        },
        {
            _id: "default-2",
            title: "Exclusive Sports & Gaming Tournaments",
            description: "Catch the action live at elite stadiums and venues around the country. Secure your spots early.",
            category: "Sports",
            coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070"
        },
        {
            _id: "default-3",
            title: "Interactive Theatre & Comedy Shows",
            description: "Experience absolute laughter and dramatic arts from world-class creators and performers in high-end venues.",
            category: "Comedy",
            coverImage: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069"
        }
    ];

    return (
        <section className="relative w-full lg:h-svh h-auto min-h-[100svh] bg-white overflow-hidden flex items-center justify-center pt-[80px] pb-8 lg:pb-0">
            <style>{`
                @keyframes blob-bounce {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.15); }
                    66% { transform: translate(-30px, 40px) scale(0.9); }
                }
                @keyframes blob-bounce-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); }
                    50% { transform: translate(-50px, 50px) scale(0.85); }
                }
                @keyframes blob-bounce-3 {
                    0%, 100% { transform: translate(0, 0) scale(0.9); }
                    50% { transform: translate(60px, -30px) scale(1.2); }
                }
                @keyframes blob-bounce-4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-40px, -40px) scale(0.95); }
                }
                .animate-blob-1 {
                    animation: blob-bounce 20s ease-in-out infinite;
                }
                .animate-blob-2 {
                    animation: blob-bounce-2 25s ease-in-out infinite;
                }
                .animate-blob-3 {
                    animation: blob-bounce-3 18s ease-in-out infinite;
                }
                .animate-blob-4 {
                    animation: blob-bounce-4 28s ease-in-out infinite;
                }
                
                .bg-fluid-blue-1 {
                    background: radial-gradient(circle at 30% 30%, #dbeafe 0%, #60a5fa 35%, #2563eb 70%, #1e40af 100%);
                }
                .bg-fluid-blue-2 {
                    background: radial-gradient(circle at 35% 35%, #bfdbfe 0%, #3b82f6 40%, #1d4ed8 75%, #172554 100%);
                }
                .bg-fluid-blue-3 {
                    background: radial-gradient(circle at 25% 25%, #e0f2fe 0%, #38bdf8 35%, #0284c7 70%, #0369a1 100%);
                }
                .bg-fluid-blue-4 {
                    background: radial-gradient(circle at 30% 30%, #c7d2fe 0%, #818cf8 40%, #4f46e5 75%, #312e81 100%);
                }
                
                .gooey-container {
                    filter: url(#hero-goo);
                    -webkit-filter: url(#hero-goo);
                    transform: translate3d(0, 0, 0);
                }
                .gooey-shadow {
                    filter: drop-shadow(0 20px 30px rgba(37, 99, 235, 0.18)) drop-shadow(0 8px 16px rgba(99, 102, 241, 0.12));
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
                .animate-bounce-slow-delay {
                    animation: bounce-slow 5s ease-in-out infinite;
                    animation-delay: 2.5s;
                }
            `}</style>

            {/* SVG Gooey Filter */}
            <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="hero-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9" />
                    </filter>
                </defs>
            </svg>

            {/* Top-Left Animated Fluid Shapes */}
            <div className="absolute top-[-100px] left-[-100px] md:top-[-180px] md:left-[-180px] w-[320px] h-[320px] md:w-[600px] md:h-[600px] z-0 pointer-events-none select-none opacity-85 gooey-shadow">
                <div className="relative w-full h-full gooey-container">
                    <div className="absolute top-[20%] left-[20%] w-[45%] h-[45%] rounded-full bg-fluid-blue-1 animate-blob-1"></div>
                    <div className="absolute top-[25%] left-[38%] w-[35%] h-[35%] rounded-full bg-fluid-blue-2 animate-blob-2"></div>
                    <div className="absolute top-[38%] left-[20%] w-[30%] h-[30%] rounded-full bg-fluid-blue-3 animate-blob-3"></div>
                    <div className="absolute top-[32%] left-[32%] w-[25%] h-[25%] rounded-full bg-fluid-blue-4 animate-blob-4"></div>
                </div>
            </div>

            {/* Bottom-Right Animated Fluid Shapes */}
            <div className="absolute bottom-[-100px] right-[-100px] md:bottom-[-200px] md:right-[-200px] w-[350px] h-[350px] md:w-[650px] md:h-[650px] z-0 pointer-events-none select-none opacity-80 gooey-shadow">
                <div className="relative w-full h-full gooey-container">
                    <div className="absolute bottom-[20%] right-[20%] w-[45%] h-[45%] rounded-full bg-fluid-blue-2 animate-blob-3"></div>
                    <div className="absolute bottom-[25%] right-[38%] w-[35%] h-[35%] rounded-full bg-fluid-blue-1 animate-blob-1"></div>
                    <div className="absolute bottom-[38%] right-[20%] w-[30%] h-[30%] rounded-full bg-fluid-blue-4 animate-blob-4"></div>
                    <div className="absolute bottom-[32%] right-[32%] w-[25%] h-[25%] rounded-full bg-fluid-blue-3 animate-blob-2"></div>
                </div>
            </div>

            <div className="w-full container mx-auto z-10 relative flex flex-col items-center h-auto py-12 lg:py-0 lg:h-[calc(100svh-80px)] justify-center">
                {mounted ? (
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={800}
                        slidesToShow={1}
                        slidesToScroll={1}
                        autoplay={true}
                        autoplaySpeed={5000}
                        arrows={false}
                        className="w-full pb-8"
                    >
                        {carouselEvents.map((event) => (
                            <div key={event._id} className="outline-none">
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-14 relative w-full">
                                    {/* Left Side: Details */}
                                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left relative">
                                        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest shadow-sm">
                                            {event.category || "Featured"}
                                        </div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight">
                                            {event.title}
                                        </h1>
                                        <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed mb-8">
                                            {event.description}
                                        </p>
                                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                                            <Link href={`/events/${event._id}`}>
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer">
                                                    Get Tickets
                                                </button>
                                            </Link>
                                            <Link href="/events">
                                                <button className="bg-white hover:bg-slate-50 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all border border-slate-200 active:scale-95 cursor-pointer">
                                                    Explore More
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Side: Thumbnail */}
                                    <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0 group flex justify-center items-center">
                                        {/* Decorative fluid-matching glow behind image */}
                                        <div className="absolute w-[85%] h-[85%] bg-gradient-to-tr from-blue-500/30 to-indigo-600/30 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 pointer-events-none z-10"></div>

                                        {/* Outer Border/Glow Wrapper */}
                                        <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.12)] relative border-4 border-white/90 backdrop-blur-xs z-20 transition-all duration-700 ease-out group-hover:scale-[95px] group-hover:shadow-[0_30px_60px_rgba(37,99,235,0.22)]">
                                            <img
                                                src={event.coverImage}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none"></div>
                                        </div>

                                        {/* Floating Glass Badge: Booking */}
                                        <div className="absolute -top-3 -right-3 md:-top-4 md:right-1 bg-white backdrop-blur-md border border-slate-200/60 py-2.5 px-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] animate-bounce-slow z-30 pointer-events-none flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-blue-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Status</div>
                                                <div className="text-xs font-black text-slate-800">Booking Open</div>
                                            </div>
                                        </div>

                                        {/* Floating Glass Badge: Verified */}
                                        <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-white/90 backdrop-blur-md border border-slate-200/60 py-2.5 px-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] animate-bounce-slow-delay z-30 pointer-events-none flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Safety</div>
                                                <div className="text-xs font-black text-slate-800">100% Verified</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <div className="animate-pulse text-slate-400 font-medium tracking-wide">Loading live experience...</div>
                    </div>
                )}
            </div>
        </section>
    );
}