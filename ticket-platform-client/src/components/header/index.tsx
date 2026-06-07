"use client";
import Image from "next/image";
import user_icon from "../../assets/user.svg";
import { IoMdMenu } from "react-icons/io";
import { Bell } from "lucide-react";


export default function Header({ navOpened, setNavOpened }: any) {
  return (
    <div className="sticky inset-y-0 left-0 z-30 w-full rounded-[]  bg-blue-50 [transition:0.5s]">
      <header className="flex items-center justify-between p-4">
        {/* left side  */}
        <div className="flex items-center justify-between w-full">
          <div onClick={() => setNavOpened(!navOpened)} className="md:hidden flex items-center justify-center cursor-pointer">
            <IoMdMenu className=" w-10 h-10 rounded-full bg-yellow-50 [transition:0.3s] hover:bg-yellow-100 text-center p-1" />
          </div>
          <div className="hidden md:block text-black">
            <h1 className="text-base md:text-xl lg:text-3xl font-semibold ">
              Welcome,TP
            </h1>
            <p className="text-sm font-normal">
              Have a nice day
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div onClick={() => setNavOpened(!navOpened)} className="hidden lg:hidden md:flex items-center justify-center cursor-pointer">
              <IoMdMenu className=" w-10 h-10 rounded-full bg-yellow-50 [transition:0.3s] hover:bg-yellow-100 text-center p-1" />
            </div>
            <div className="flex items-center justify-center cursor-pointer relative">
              <h3 className="absolute -top-1 -right-1 bg-[#FF181F] rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                2
              </h3>
              <div className="bg-gradient-to-t from-[#649DC2] to-[#99D7FF] w-12 h-12 rounded-full flex items-center justify-center">
                <Bell color="#fff" />
              </div>
            </div>
            <div className="flex w-10 md:w-14 xl:w-auto flex-1 items-center gap-3 cursor-pointer">
              <Image
                src={user_icon}
                alt="logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full "
              />
              <h1 className="text-lg text-black font-medium hidden xl:block">TP</h1>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
