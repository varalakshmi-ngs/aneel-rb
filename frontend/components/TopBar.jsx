"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAdminToken = Boolean(localStorage.getItem("adminToken"));
    const hasMemberToken = Boolean(localStorage.getItem("member_token"));
    setIsLoggedIn(hasAdminToken || hasMemberToken);
  }, [pathname]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("member_token");
      localStorage.removeItem("member_info");
    }
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <div
      className="
        fixed top-0 left-0 w-full
        bg-white text-[#022147]
        px-4 md:px-8
        flex items-center justify-between
        z-50 shadow-sm border-b border-gray-200
        h-[70px] sm:h-[80px] md:h-[90px]
      "
    >
      {/* Logo Section */}
      <Link href="/" className="flex items-center flex-shrink-0">
        <Image 
          src="/images/cross.png" 
          alt="Church Logo" 
          width={45} 
          height={45} 
          className="object-contain w-[35px] h-[35px] sm:w-[45px] sm:h-[45px]" 
        />
      </Link>

      {/* Title Section - Centered using Flexbox for better responsiveness */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-2">
        <h1
          className="
            font-black tracking-tight leading-none
            text-[16px] xs:text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px]
            text-[#022147]
            whitespace-nowrap overflow-hidden text-ellipsis
          "
        >
          St. Johns Lutheran Church
        </h1>
        <span className="text-[#F74F22] font-bold text-[10px] sm:text-[14px] md:text-[16px] tracking-widest uppercase">
          Since 2000
        </span>
      </div>

      {/* Auth Actions Section */}
      <div className="flex items-center flex-shrink-0">
        {!isLoggedIn ? (
          <Link 
            href="/login" 
            className="inline-flex items-center rounded-xl bg-[#022147] px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-black text-white hover:bg-[#F74F22] transition-colors shadow-lg shadow-blue-900/10 uppercase tracking-widest"
          >
            Sign In
            <Image src="/enter.png" alt="Login" width={16} height={16} className="ml-2 hidden sm:block" />
          </Link>
        ) : (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center rounded-xl bg-red-600 px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-black text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/10 uppercase tracking-widest"
          >
            Sign Out
            <Image src="/enter.png" alt="Logout" width={16} height={16} className="ml-2 rotate-180 hidden sm:block" />
          </button>
        )}
      </div>
    </div>
  );
}
