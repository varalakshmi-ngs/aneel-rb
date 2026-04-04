"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <section className="w-full flex justify-center bg-[#ffff] px-4 md:px-8 lg:px-12">
      <footer className="relative w-full max-w-7xl bg-[#ffff] rounded-t-3xl overflow-hidden text-[#022147]">
        {/* Background Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/footer-shape.png"
            alt="Footer Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* === Responsive Flex Layout === */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8">
            {/* === Left: Logo === */}
            <div className="flex-1">
              <Image
                src="/images/christlogo.png"
                alt="Church Logo"
                width={180}
                height={60}
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain"
              />
            </div>

            {/* === Middle: Quick Links === */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-[#022147]">
                <li><Link href="/" className="hover:text-[#F74F22]">Home</Link></li>
                <li><a href="/Events" className="hover:text-[#F74F22]">Events</a></li>
                <li><a href="/aboutus" className="hover:text-[#F74F22]">About Us</a></li>
                <li><a href="/gallery" className="hover:text-[#F74F22]">Gallery</a></li>
                <li><a href="/PccMembers" className="hover:text-[#F74F22]">PCC Members</a></li>
                <li><a href="/PastorList" className="hover:text-[#F74F22]">Pastors</a></li>
                <li><a href="/contactus" className="hover:text-[#F74F22]">Contact Us</a></li>
              </ul>
            </div>

            {/* === Right: Jesus Image === */}
            <div className="flex-1 flex justify-center sm:justify-end">
              <Image
                src="/images/jesusimage.png"
                alt="Jesus Image"
                width={460}
                height={460}
                className="object-contain mt-4 md:-mt-10 lg:-mt-16"
              />
            </div>
          </div>

          {/* === Quote (Below All Layouts) === */}
          {/* === Quote (Below All Layouts) === */}
          <div className="mt-10 w-full flex justify-center">
            <p className="text-[#022147] font-bold italic text-4xl md:text-5xl lg:text-6xl tracking-[0.1em] text-center w-full">
              JESUS WILL SAVE US 
            </p>
          </div>


          {/* Copyright */}
          <div className="mt-12 border-t border-gray-600 pt-6 text-center text-[#022147]">
            Copyright © 2025 Finclix. All Rights Reserved
          </div>
        </div>
      </footer>
    </section>
  );
}
