'use client';

import { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { useRouter } from "next/navigation";
import { useAuthService } from '@/src/hooks/auth';
import AuthLayout from '..';
import Cookies from 'js-cookie';
export const dynamic = 'force-dynamic';
export const dynamicParams = true;


export default function OtpVerificationPage() {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { verifyOtp, resendOtp } = useAuthService();
    const router = useRouter();
    const email = Cookies.get('email') || '';


    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        await resendOtp({ email })
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const pastedArray = pastedData.split('').filter(char => /^\d$/.test(char));

        if (pastedArray.length > 0) {
            const newOtp = [...otp];
            pastedArray.forEach((char, i) => {
                if (i < 6) {
                    newOtp[i] = char;
                }
            });
            setOtp(newOtp);

            const nextIndex = Math.min(pastedArray.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            message.error('Please enter the complete OTP');
            return;
        }

        if (!email) {
            message.error("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            message.error("Invalid email format");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyOtp({
                email,
                otp: otpString
            });

            if (res?.statusCode === 201) {
                router.push(
                    `/auth/reset-password?email=${encodeURIComponent(email)}`
                );
            }

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Verify OTP"
            subtitle={`Please check your email. We have sent a code to ${email}.`}
            leftTitle="ALMOST THERE"
            leftSubtitle="VERIFY YOUR IDENTITY"
            leftDescription="Your email address is the key to accessing your account. Make sure it’s the correct one."
        >
            <div className="w-full max-w-md relative z-10">
                {/* OTP Input Fields */}
                <div className="my-8 flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-12 h-12 md:w-14 md:h-14 bg-[#F5F5F5] hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl text-center text-xl md:text-2xl font-bold text-[#1A1A1A] focus:outline-none transition-colors border-none shadow-sm"
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-sm text-gray-500 font-medium">
                        Didn't receive code?
                    </p>
                    <button onClick={handleResendOtp} className="text-sm font-bold text-[#0052cc] hover:text-[#003d99] transition-colors cursor-pointer">
                        Resend
                    </button>
                </div>

                <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    onClick={handleSubmit}
                    className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
                >
                    Verify
                </Button>
            </div>
        </AuthLayout>
    );
}