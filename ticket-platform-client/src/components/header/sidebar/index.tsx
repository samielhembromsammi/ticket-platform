"use client";

import { useState } from "react";
import { adminMenuData, userMenuData } from "../../../data";
import NavItem from "../nav-menu";
import logout_image from "../../../assets/menu/logout.svg";
import Image from "next/image";
import { useAuthService } from "@/src/hooks/auth";
import sidebar_bg from "../../../assets/side_layout_bg.svg"
import { useAuthStore } from "@/src/store/authStore";

export default function Sidebar({ navOpened, setNavOpened }: any) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { logoutUser } = useAuthService();
  const { user } = useAuthStore();

  const menuLinks = user?.role === "admin"
    ? adminMenuData?.linkData
    : userMenuData?.linkData;

  const closeAllSubmenus = (): void => {
    setOpenSubmenu(null);
  };

  const handleSubmenuToggle = (label: string): void => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity ${navOpened ? "opacity-100 block" : "opacity-0 hidden"
          }`}
        onClick={() => setNavOpened(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-30 h-screen w-[260px] bg-black overflow-y-auto transition-transform duration-300 
          ${navOpened ? "translate-x-0 pt-24" : "-translate-x-full"}
          lg:translate-x-0  
        `}
      >
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={sidebar_bg}
            alt="Sidebar background"
            fill
            className="object-content"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">

          <div className=" px-2 flex items-center justify-center py-4">
            <h1 className="text-3xl font-bold text-white">TP</h1>
          </div>
          <div className="border-b border-b-[#8CC6A7]" />
          <div>
            <nav>
              {menuLinks?.map((section, sIndex) => (
                <div key={sIndex} className="space-y-4">
                  {section?.menu?.map((item, index) => (
                    <NavItem
                      key={index}
                      href={item?.href || "#"}
                      icon={item?.icon}
                      label={item?.label}
                      submenu={item?.submenu}
                      openSubmenu={openSubmenu}
                      handleSubmenuToggle={handleSubmenuToggle}
                      setNavOpened={setNavOpened}
                      closeAllSubmenus={closeAllSubmenus}
                    />
                  ))}
                </div>
              ))}

              <button
                onClick={logoutUser}
                className="text-xl font-medium flex items-center gap-3 my-4 px-6 py-3 text-white cursor-pointer hover:text-red-600 transition"
              >
                <Image src={logout_image} alt="icon" width={30} height={30} />
                Log Out
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
