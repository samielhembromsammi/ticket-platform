import ResetPasswordPage from "@/src/components/auth/reset-password";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password - Ticket Platform",
  description: "Reset Password Page for Ticket Platform",
};


export default function ResetPassword() {
  return (
    <ResetPasswordPage />
    // <Suspense fallback={
    //   <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
    //     <div className="text-center">
    //       <p className="text-lg">Loading...</p>
    //     </div>
    //   </div>
    // }>
    //   <ResetPasswordPage />
    // </Suspense>
  );
}
