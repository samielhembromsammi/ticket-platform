"use client";
import React, { ReactNode, useState } from "react";
import Header from "./../../components/header/index";
import Sidebar from "./../../components/header/sidebar/index";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [navOpened, setNavOpened] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen h-full">
      {/* side bar  */}
      <Sidebar navOpened={navOpened} setNavOpened={setNavOpened} />

      {/* top and children content  */}
      <div
        className={`flex flex-col flex-1 min-w-0 lg:ml-[260px] transition-all duration-300`}
      >
        <Header navOpened={navOpened} setNavOpened={setNavOpened} />
        {/* min-h-[calc(100vh-48px)]  */}
        <main className="overflow-y-auto overflow-x-hidden w-full min-h-[calc(100vh-178px)] h-full bg-[#fff] font-primary mt-3 pr-3">
          {children}
        </main>
      </div>
    </div>
  );
}
