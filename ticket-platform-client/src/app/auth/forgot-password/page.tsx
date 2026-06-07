import ForgetPasswordPage from "@/src/components/auth/forget-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password Page - Ticket Platform",
  description: "Forgot Password Page for Ticket Platform",
};


export default function ForgotPasswordPage() {

  return (
    <ForgetPasswordPage />
  )
}
