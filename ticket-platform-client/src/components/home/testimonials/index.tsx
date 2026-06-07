"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TESTIMONIALS = [
    {
        name: "Sarah K.",
        role: "Music Lover",
        text: "Found my favorite band's concert in seconds. The experience from booking to entry was seamless!",
        avatar: "SK",
    },
    {
        name: "James R.",
        role: "Corporate Planner",
        text: "Used this platform for our company workshop. Easy bulk booking and instant e-tickets. Highly recommend.",
        avatar: "JR",
    },
    {
        name: "Priya M.",
        role: "Frequent Attendee",
        text: "The premium section is worth it — exclusive events I can't find anywhere else. Already booked 5 this year.",
        avatar: "PM",
    },
    {
        name: "Alex D.",
        role: "Sports Fan",
        text: "Got front row seats to the playoffs. The UI is incredibly intuitive and fast.",
        avatar: "AD",
    },
    {
        name: "Michael T.",
        role: "Theater Enthusiast",
        text: "Best ticketing experience I've had. Customer support was incredibly helpful when I needed to change dates.",
        avatar: "MT",
    },
];

export function Testimonials() {
    const sliderRef = useRef<Slider>(null);
    const [mounted, setMounted] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(3);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlidesToShow(1);
            } else {
                setSlidesToShow(3);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "0px",
        slidesToShow: slidesToShow,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: false,
        dots: true,
        appendDots: (dots: React.ReactNode) => (
            <div>
                <ul className="flex justify-center gap-2 mt-4">
                    {dots}
                </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2.5 h-2.5 rounded-full bg-black/20 transition-all duration-300" />
        ),
    };
    return (
        <section className="relative py-24 mt-14 overflow-hidden bg-white">

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />


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

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Left Content */}
                    <div className="lg:w-1/3 text-left w-full z-10">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight drop-shadow-sm">
                            What<br />
                            <span className="text-blue-600">Attendees</span><br />
                            Say
                        </h2>
                        <div className="flex gap-4 mt-8">
                            <div className="w-14 h-14 bg-black/5 backdrop-blur-md text-slate-900 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm border border-black/10">
                                5<Star className="w-5 h-5 ml-1 text-yellow-500 fill-yellow-500" />
                            </div>
                            <div className="w-14 h-14 bg-black/5 backdrop-blur-md text-slate-900 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border border-black/10">
                                10k+
                            </div>
                        </div>
                    </div>

                    {/* Right Slider */}
                    <div className="lg:w-2/3 w-full testimonial-slider-container">
                        {mounted && (
                            <Slider key={`${mounted}-${slidesToShow}`} ref={sliderRef} {...settings}>
                                {TESTIMONIALS.map((testimonial, i) => (
                                    <div key={i} className="py-10">
                                        <div className="testimonial-card bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center mx-3 transition-all duration-500 ease-out border border-white">
                                            <div className="w-24 h-24 rounded-full border-4 border-indigo-500 p-1 mb-6 shadow-md bg-white">
                                                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                                    {testimonial.avatar}
                                                </div>
                                            </div>
                                            <h3 className="font-extrabold text-slate-900 text-xl mb-2">{testimonial.name}</h3>
                                            <div className="flex items-center justify-center gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                                                ))}
                                                <span className="text-slate-900 font-bold ml-2 text-sm">5.0</span>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed font-medium px-2">
                                                {testimonial.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        )}

                        {/* Custom Navigation Arrows */}
                        <div className="flex justify-center gap-4 mt-2">
                            <button
                                onClick={() => sliderRef.current?.slickPrev()}
                                className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-sm text-slate-900 hover:bg-black/10 flex items-center justify-center transition shadow-sm border border-black/10 cursor-pointer z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => sliderRef.current?.slickNext()}
                                className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-sm text-slate-900 hover:bg-black/10 flex items-center justify-center transition shadow-sm border border-black/10 cursor-pointer z-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slick dot active state override and center mode scaling */}
            <style jsx global>{`
                .testimonial-slider-container .slick-track {
                    display: flex;
                    align-items: center;
                }
                
                .testimonial-slider-container .slick-slide {
                    transition: all 0.5s ease;
                    transform: scale(0.85);
                    opacity: 0.6;
                    outline: none;
                }
                
                .testimonial-slider-container .slick-slide.slick-center {
                    transform: scale(1.05);
                    opacity: 1;
                    z-index: 10;
                }
                
                .testimonial-slider-container .slick-slide.slick-center .testimonial-card {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    border-color: rgba(255, 255, 255, 1);
                }

                .testimonial-slider-container .slick-dots li {
                    margin: 0;
                    width: auto;
                    height: auto;
                }
                .testimonial-slider-container .slick-dots li div {
                    width: 8px;
                    height: 8px;
                }
                .testimonial-slider-container .slick-dots li.slick-active div {
                    background-color: #0066ff;
                    width: 24px;
                    border-radius: 9999px;
                }
            `}</style>
        </section>
    );
}