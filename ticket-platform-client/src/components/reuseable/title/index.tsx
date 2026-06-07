"use client";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface TitleProps {
  title: string;
  isShowBackButton?: boolean;
  className?: string
}

export default function Title({ title, isShowBackButton = false, className }: TitleProps) {
  const router = useRouter();

  return (
    <div className={`text-xl md:text-2xl lg:text-3xl text-black font-bold flex items-center gap-4 py-3 capitalize ${className}`}>
      {isShowBackButton && (
        <button onClick={() => router.back()} className="flex items-center cursor-pointer">
          <FaAngleLeft />
        </button>
      )}
      {title}
    </div>
  );
}
