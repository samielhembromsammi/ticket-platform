import OtpVerificationPage from "@/src/components/auth/otp-verify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification Page - Ticket Platform",
  description: "OTP Verification Page for Ticket Platform",
}

export default function OTPVerifyPage() {
  return (
    <OtpVerificationPage />
    // <Suspense fallback={
    //   <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
    //     <div className="text-center">
    //       <p className="text-lg">Loading...</p>
    //     </div>
    //   </div>
    // }>
    //   <OtpVerificationPage />
    // </Suspense>
  );
}
