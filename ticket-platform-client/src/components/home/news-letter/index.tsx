"use client";

import { Mail, Bell, CheckCircle } from "lucide-react";
import { useState } from "react";

export function NewsLetter() {
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubscribed(true);
    };

    return (
        <section className="container mx-auto px-6 py-16">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 lg:p-16 gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 shadow-inner">
                            <Bell className="w-4 h-4" />
                            <span>Stay in the loop</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                            Get early access to <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                the best events
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                            Sign up for our newsletter and receive personalized recommendations, exclusive presale codes, and special discounts straight to your inbox.
                        </p>
                    </div>

                    {/* Right Form */}
                    <div className="w-full md:w-auto flex-1 max-w-md">
                        {subscribed ? (
                            <div className="flex flex-col items-center justify-center p-10 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-md shadow-2xl animate-fade-in-up">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-5">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                                <p className="text-slate-400">
                                    Keep an eye on your inbox for the latest updates and exclusive offers.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.98] cursor-pointer"
                                    >
                                        Subscribe Now
                                    </button>
                                    <p className="text-xs text-slate-500 text-center mt-3 font-medium">
                                        By subscribing, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}