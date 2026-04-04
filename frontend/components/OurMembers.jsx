"use client";

import Image from "next/image";

export default function Ourgallery() {
  return (
    <main className="bg-[#ffffff] text-[#022147]">
      {/* ===== HERO / BREADCRUMB SECTION ===== */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/images/chruch-01.jpg"
          alt="Church Banner"
          fill
          className="object-cover brightness-[0.45]"
        />

        {/* ===== Heading with Cross Icons ===== */}
        <div className="relative z-10 text-center text-white flex items-center justify-center gap-4">
          {/* Left Cross */}
          <Image
            src="/images/cross.png"
            alt="Cross Icon"
            width={100}
            height={100}
            className="object-contain"
          />

          {/* Heading Text */}
          <h1 className="text-4xl md:text-6xl font-semibold">
            Our Members
          </h1>

          {/* Right Cross */}
          <Image
            src="/images/cross.png"
            alt="Cross Icon"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </section>
    </main>
  );
}
