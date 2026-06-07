'use client';

import React from 'react';

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    leftTitle?: string;
    leftSubtitle?: string;
    leftDescription?: string;
    children: React.ReactNode;
}

export default function AuthLayout({
    title,
    subtitle,
    leftTitle = 'WELCOME',
    leftSubtitle = 'TO OUR PLATFORM',
    leftDescription = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white w-full overflow-hidden">
            <style>{`
                @keyframes blob-bounce-auth {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.15); }
                    66% { transform: translate(-30px, 40px) scale(0.9); }
                }

                @keyframes blob-bounce-auth-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); }
                    50% { transform: translate(-50px, 50px) scale(0.85); }
                }

                @keyframes blob-bounce-auth-3 {
                    0%, 100% { transform: translate(0, 0) scale(0.9); }
                    50% { transform: translate(60px, -30px) scale(1.2); }
                }

                @keyframes blob-bounce-auth-4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-40px, -40px) scale(0.95); }
                }

                .animate-blob-auth-1 {
                    animation: blob-bounce-auth 20s ease-in-out infinite;
                }

                .animate-blob-auth-2 {
                    animation: blob-bounce-auth-2 25s ease-in-out infinite;
                }

                .animate-blob-auth-3 {
                    animation: blob-bounce-auth-3 18s ease-in-out infinite;
                }

                .animate-blob-auth-4 {
                    animation: blob-bounce-auth-4 28s ease-in-out infinite;
                }
            `}</style>

            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0052cc] to-[#003d99] relative items-center justify-center p-12 text-white overflow-hidden">
                {/* Blur Background Blobs */}
                <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-[#0066ff] to-[#0047b3] rounded-full animate-blob-auth-1 blur-2xl opacity-50 mix-blend-screen"></div>

                <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#00bfff] to-[#0047b3] rounded-full animate-blob-auth-2 blur-2xl opacity-50 mix-blend-screen"></div>

                <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-[#0066ff] to-[#003d99] rounded-full animate-blob-auth-3 blur-2xl opacity-50 mix-blend-screen"></div>

                {/* Solid Blobs */}
                <div className="absolute -left-32 bottom-0 w-[500px] h-[500px] bg-[#0066ff] rounded-full animate-blob-auth-1"></div>

                <div className="absolute -right-32 top-10 w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-4"></div>

                {/* Content */}
                <div className="relative z-10 text-left max-w-lg -ml-20">
                    <h1 className="text-6xl font-bold mb-4 tracking-wider uppercase drop-shadow-lg">
                        {leftTitle}
                    </h1>

                    <h2 className="text-2xl font-bold mb-8 tracking-widest uppercase drop-shadow-md">
                        {leftSubtitle}
                    </h2>

                    <p className="text-sm text-blue-100 leading-relaxed font-light drop-shadow-sm">
                        {leftDescription}
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
                <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-1 opacity-90 hidden lg:block"></div>

                <div className="w-full max-w-md relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-[#6E6E6E] mb-8 text-sm">
                            {subtitle}
                        </p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}