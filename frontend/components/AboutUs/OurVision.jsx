"use client";

import Image from "next/image";
import Link from "next/link";

export default function SermonsEventsSection() {
  return (
    <section className="bg-[#f9fafb] py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* ===== Left image grid ===== */}
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/images/chruch-02.png"
            alt="Sermon 1"
            width={300}
            height={300}
            className="rounded-2xl shadow-md object-cover"
          />
          <Image
            src="/images/chruch-03.webp"
            alt="Sermon 2"
            width={300}
            height={300}
            className="rounded-2xl shadow-md object-cover mt-8"
          />
          <Image
            src="/images/chruch-04.jpg"
            alt="Sermon 3"
            width={300}
            height={300}
            className="rounded-2xl shadow-md object-cover col-span-2"
          />
        </div>

        {/* ===== Right content ===== */}
        <div>
          <h2 className="uppercase tracking-wide font-medium flex items-center space-x-2 text-[#F74F22] text-sm lg:text-base">
            <span className="text-[#F74F22] text-lg">+</span>
            <span className="font-bold">Our Vision</span>
          </h2>

          <h3 className="text-3xl md:text-4xl font-bold text-[#022147] mt-3 mb-5">
            We Provide Exceptional Sermons & Events
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Every Sunday, our sermons aim to inspire, comfort, and challenge believers to live faithfully.
            Through special events, retreats, and outreach programs, we strengthen spiritual connections.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            We believe in building a strong spiritual foundation where everyone feels welcomed and valued.
          </p>
          <Link
            href="/contactus"
            className="mt-6 inline-block bg-[#F74F22] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
