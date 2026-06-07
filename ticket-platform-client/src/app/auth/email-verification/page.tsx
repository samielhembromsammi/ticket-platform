import EmailVerificationPage from "@/src/components/auth/email-verification";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email Verification Page - Ticket Platform",
    description: "Email Verification Page for Ticket Platform",
}

export default function EmailVerification() {
    return (
        <EmailVerificationPage />
    );
}
