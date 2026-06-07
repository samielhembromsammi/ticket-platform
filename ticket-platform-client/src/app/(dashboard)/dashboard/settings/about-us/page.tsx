'use client'
import React from 'react'
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import Title from '@/src/components/reuseable/title';
import { Spin } from 'antd';
import { useAboutUsService } from '@/src/hooks/dashboard/settings';



export default function AboutPage() {
  const { abouts, loading } = useAboutUsService();
  return (
    <div>
      <Title title="About Us" />
      <div className="p-4">
        <div className="w-max ml-auto my-3">
          <Link href="/dashboard/settings/about-us/edit">
            <button className="flex items-center gap-3 bg-primary text-white py-2 px-14 rounded-full cursor-pointer">
              <FaEdit />
              <span>Edit</span>
            </button>
          </Link>
        </div>
        <Spin spinning={loading}>
          <p>{abouts[0]?.content ?? ""}</p>
        </Spin>
      </div>
    </div>
  )
}
