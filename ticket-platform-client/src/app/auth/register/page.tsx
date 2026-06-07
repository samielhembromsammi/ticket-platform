import RegisterPage from "@/src/components/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register Page - Ticket Platform",
    description: "Register Page for Ticket Platform",
}

export default function Register() {
    return (
        <RegisterPage />
    )
}
