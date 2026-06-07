'use client';

import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { FaEnvelope } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthService } from '@/src/hooks/auth';
import AuthLayout from '..';

export default function ForgetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuthService();
    const router = useRouter();
    const [form] = Form.useForm();

    const handleSubmit = async (values: { email: string }) => {
        Cookies.remove("token");
        setLoading(true);
        const res = await forgotPassword({ email: values.email })
        console.log("ressssssss", res);
        if (res?.statusCode !== 201) {
            message.error(res?.message || 'Something went wrong. Please try again later.');
            setLoading(false);
        } else {
            router.push(`/auth/otp-verify?email=${encodeURIComponent(values.email)}`)
            setLoading(false);
            Cookies.set("token", res?.data?.token);
            Cookies.set("email", values.email);
        }
    };
    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email address to get a verification code for resetting your password."
            leftTitle="NO WORRIES"
            leftSubtitle="WE GOT YOU"
            leftDescription="Enter your email address and we will send you a verification code to reset your password."
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
                    className="mb-8"
                >
                    <Input
                        size="large"
                        prefix={<FaEnvelope className="text-gray-500 mr-2 text-lg" />}
                        placeholder="Email Address"
                        className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                    />
                </Form.Item>

                <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    loading={loading}
                    className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
                >
                    Send OTP
                </Button>

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Remembered your password?{' '}
                    <Link href="/auth/login" className="text-[#0052cc] font-bold hover:text-[#003d99]">
                        Sign in
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
}