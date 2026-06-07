import LoginPage from "@/src/components/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page - Ticket Platform",
  description: "Login Page for Ticket Platform",
}

export default function Login() {

  return (
    <LoginPage />
  )
}
