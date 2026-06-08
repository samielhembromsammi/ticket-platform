'use client';

import { Input, Button, Form, Checkbox } from 'antd';
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthService } from '@/src/hooks/auth';
import { useAuthStore } from '@/src/store/authStore';
import AuthLayout from '..';
import { useState } from 'react';
// import useApi from '@/src/hooks/use-api'; // removed – not needed

export default function LoginPage() {
    const [remember, setRemember] = useState(false);
    const { login, loading } = useAuthService();
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [form] = Form.useForm();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const res = await login({ ...values, remember });

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

                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Unexpected login error:", error);
        }
    };

    const handleGoogleLogin = () => {
        const baseUrl = process.env.NEXT_PUBLIC_URI?.replace(/\/$/, "") ?? "";
        // Navigate to backend OAuth endpoint without creating a new history entry
        window.location.replace(`${baseUrl}/auth/google`);
    };


    return (
        <AuthLayout
            title="Sign in"
            subtitle="Welcome back, you've been missed!"
            leftTitle="WELCOME BACK"
            leftSubtitle="SIGN IN"
            leftDescription="Enter your credentials to access your account and continue where you left off."
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                className="w-full"
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Email is required." },
                        { type: "email", message: "Enter a valid email address." },
                    ]}
                    className="mb-4"
                >
                    <Input
                        size="large"
                        prefix={<FaUser className="text-gray-500 mr-2 text-lg" />}
                        placeholder="User Name"
                        className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Password is required." },
                        { min: 6, message: "Password must be at least 6 characters." },
                    ]}
                    className="mb-4"
                >
                    <Input.Password
                        size="large"
                        prefix={<FaLock className="text-gray-500 mr-2 text-lg" />}
                        placeholder="Password"
                        className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                        iconRender={(visible) => (
                            <span className="text-[#0052cc] text-xs font-bold uppercase cursor-pointer hover:text-[#003d99] tracking-wider mr-2">
                                {visible ? "Hide" : "Show"}
                            </span>
                        )}
                    />
                </Form.Item>

                <div className="flex items-center justify-between mb-8 px-1">
                    <Checkbox
                        className="text-gray-600 custom-checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    >
                        <span className="text-sm font-medium text-gray-600">Remember me</span>
                    </Checkbox>

                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-[#0052cc] font-bold hover:text-[#003d99] transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    loading={loading}
                    className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
                >
                    Sign in
                </Button>

                <div className="relative flex items-center py-2 mb-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Button
                    size="large"
                    className="w-full !h-14 !rounded-xl !border-gray-800 text-gray-800 text-lg font-semibold hover:!border-black hover:!text-black bg-transparent"
                    // onClick={handleGoogleLogin}

                    icon={<FcGoogle style={{ fontSize: '1.5rem' }} />}
                >
                    Sign in with Google
                </Button>

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-[#0052cc] font-bold hover:text-[#003d99]">
                        Sign up
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
}