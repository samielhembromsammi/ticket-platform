"use client";
import React from "react";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { Spin } from "antd";
import Title from "@/src/components/reuseable/title";
import { useTermsService } from "@/src/hooks/dashboard/settings";

export default function TermsService() {
  const { terms, loading } = useTermsService();
  return (
    <div>
      <Title title="Terms and Condition" />
      <div className="p-4">
        <div className="w-max ml-auto my-3">
          <Link href="/dashboard/settings/terms-service/edit">
            <button className="flex items-center gap-3 bg-primary text-white py-2 px-14 rounded-full cursor-pointer">
              <FaEdit />
              <span>Edit</span>
            </button>
          </Link>
        </div>
        <Spin spinning={loading}>
          <p>{terms[0]?.content ?? ""}</p>
        </Spin>
      </div>
    </div>
  );
}
