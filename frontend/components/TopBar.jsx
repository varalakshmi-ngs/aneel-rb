"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAdminLoggedIn(Boolean(localStorage.getItem("adminToken")));
  }, [pathname]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
    }
    setIsAdminLoggedIn(false);
    router.push("/login");
  };

  const isAdminRoute = pathname?.startsWith("/admin");
  const showSignOut = isAdminRoute && isAdminLoggedIn;
  const showSignIn = !showSignOut;

  return (
    <div
      className="
        fixed top-0 left-0 w-full
        bg-white text-[#022147]
        py-3 px-4 md:px-8
        flex items-center justify-between
        z-50 shadow-sm border-b border-gray-200
      "
      style={{ height: "70px" }}
    >
      <Link href="/" className="flex items-center flex-shrink-0">
        <div className="flex items-center flex-shrink-0">
          <Image src="/images/cross.png" alt="Church Logo" width={32} height={32} className="object-contain sm:w-[38px] sm:h-[38px]" />
        </div>
      </Link>

      <div
        className="
          absolute left-1/2 transform -translate-x-1/2
          flex flex-col sm:flex-row items-center sm:items-baseline
          text-center space-x-0 sm:space-x-2
        "
      >
        <h1
          className="
            font-extrabold tracking-wide
            text-[14px] xs:text-[16px]
            sm:text-[29px] md:text-[29px] lg:text-[49px]
            text-[#022147]
            whitespace-nowrap
          "
        >
          St. Johns Lutheran Church
        </h1>
        <span className="text-[#022147] font-semibold text-[12px] xs:text-[14px] sm:text-[18px] md:text-[24px] whitespace-nowrap">
          Since 2000
        </span>
      </div>

      <div className="flex items-center flex-shrink-0">
        {showSignIn && (
          <Link href="/login" className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600">
            Sign In
            <Image src="/enter.png" alt="Login" width={20} height={20} className="ml-2" />
          </Link>
        )}

        {showSignOut && (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
          >
            Sign Out
            <Image src="/enter.png" alt="Logout" width={20} height={20} className="ml-2 rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
