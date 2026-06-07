'use client';

import { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthService } from '@/src/hooks/auth';
import { useAuthStore } from '@/src/store/authStore';
import AuthLayout from '..';

export default function RegisterPage() {
    const [remember, setRemember] = useState(false);
    const { register, loading } = useAuthService();
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [form] = Form.useForm();

    const handleSubmit = async (values: { fullName: string; email: string; password: string }) => {
        try {
            const formData = {
                ...values,
                role: "user",
            };
            const res = await register(formData);

            if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
                const token = res?.data?.token || res?.data?.tokens?.accessToken;
                const user = res?.data?.results || res?.data?.user;

                if (token) {
                    Cookies.set("token", token, {
                        expires: remember ? 7 : undefined,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                    });
                    localStorage.setItem("token", token);
                }

                if (user) {
                    setUser(user);
                }

                router.push("/auth/email-verification");
            }
        } catch (error) {
            console.error("Unexpected register error:", error);
        }
    };

    return (
        <AuthLayout
            title="Sign up"
            subtitle="Create your account and get started"
            leftTitle="JOIN US"
            leftSubtitle="CREATE AN ACCOUNT"
            leftDescription="Join our platform and explore amazing features with a smooth and secure experience."
        >
            <Form form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                className="w-full">
                <Form.Item name="fullName"
                    rules={[
                        { required: true, message: "Full name is required." },
                        { min: 3, message: "Full name must be at least 3 characters." },
                    ]}>
                    <Input
                        size="large"
                        placeholder="Full Name"
                        prefix={<FaUser className="mr-2 text-gray-500" />}
                        className="!h-14 rounded-xl"

                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Email is required." },
                        { type: "email", message: "Enter a valid email address." },
                    ]}>
                    <Input
                        size="large"
                        placeholder="Email Address"
                        prefix={<FaEnvelope className="mr-2 text-gray-500" />}
                        className="!h-14 rounded-xl"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Password is required." },
                        { min: 6, message: "Password must be at least 6 characters." },
                    ]}>
                    <Input.Password
                        size="large"
                        placeholder="Password"
                        prefix={<FaLock className="mr-2 text-gray-500" />}
                        className="!h-14 rounded-xl"
                    />
                </Form.Item>

                <Button
                    htmlType="submit"
                    type="primary"
                    loading={loading}
                    className="w-full !h-14 !rounded-xl"
                >
                    Sign up
                </Button>

                <div className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/auth/login">
                        Sign in
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
}