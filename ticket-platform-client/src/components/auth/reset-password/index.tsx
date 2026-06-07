'use client';

import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthService } from '@/src/hooks/auth';
import AuthLayout from '..';

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { resetPassword } = useAuthService();
    const [form] = Form.useForm();


    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        try {
            setLoading(true);
            const res = await resetPassword({ newPassword: values.password, confirmPassword: values.confirmPassword });
            if (res?.statusCode === 201) {
                return router.push("/auth/login");
            }
        } catch (e: any) {
            console.error(e);
            message.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Please enter your new password and confirm it."
            leftTitle="SECURE IT"
            leftSubtitle="SET NEW PASSWORD"
            leftDescription="Provide secure and unique password for your account also don't use your old password."
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                className="w-full"
            >
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Password is required" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                    className="mb-4"
                >
                    <Input.Password
                        size="large"
                        prefix={<FaLock className="text-gray-500 mr-2 text-lg" />}
                        placeholder="New Password"
                        className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                        iconRender={(visible) => (
                            <span className="text-[#0052cc] text-xs font-bold uppercase cursor-pointer hover:text-[#003d99] tracking-wider mr-2">
                                {visible ? "Hide" : "Show"}
                            </span>
                        )}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: "Please confirm your password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"));
                            },
                        }),
                    ]}
                    className="mb-8"
                >
                    <Input.Password
                        size="large"
                        prefix={<FaLock className="text-gray-500 mr-2 text-lg" />}
                        placeholder="Confirm Password"
                        className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                        iconRender={(visible) => (
                            <span className="text-[#0052cc] text-xs font-bold uppercase cursor-pointer hover:text-[#003d99] tracking-wider mr-2">
                                {visible ? "Hide" : "Show"}
                            </span>
                        )}
                    />
                </Form.Item>

                <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    loading={loading}
                    className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
                >
                    Confirm
                </Button>
            </Form>
        </AuthLayout>
    );
}