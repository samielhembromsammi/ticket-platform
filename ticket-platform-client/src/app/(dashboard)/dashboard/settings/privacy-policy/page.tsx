"use client"
import Link from "next/link"
import { FaEdit } from "react-icons/fa";
import { Spin } from "antd";
import Title from "@/src/components/reuseable/title";
import { usePrivacyPolicyService } from "@/src/hooks/dashboard/settings";

export default function PrivacyPolicy() {
  const { policies, loading } = usePrivacyPolicyService();
  return (
    <div>
      <Title title="Privacy Policy" />
      <div className="p-4">
        <div className="w-max ml-auto my-3">
          <Link href="/dashboard/settings/privacy-policy/edit">
            <button className="flex items-center gap-3 bg-primary text-white py-2 px-14 rounded-full cursor-pointer">
              <FaEdit />
              <span>Edit</span>
            </button>
          </Link>
        </div>
        <Spin spinning={loading}>
          <p>{policies[0]?.content ?? ""}</p>
        </Spin>
      </div>
    </div>
  );
}
