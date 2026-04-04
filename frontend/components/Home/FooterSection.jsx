"use client";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export default function Footer() {
  return (
    <section className="w-full flex justify-center bg-[#0c2c2c] px-4 md:px-8 lg:px-12">
      <footer className="relative w-full max-w-7xl rounded-t-3xl overflow-hidden text-white">
        {/* Background Overlay */}
        <div className="absolute inset-0">
          <img
            src="/footer-shape.png" // 👉 put your mesh in /public/footer-bg.png
            alt="Footer Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,68,67,0)_0%,rgba(20,68,67,0.8)_14%,rgba(20,68,67,0.96)_30%,#144443_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Head Office */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Finclix</h2>
              <h3 className="text-lg font-semibold mb-3">Head office</h3>
              <p className="mb-4">
                2972 Westheimer Rd. Santa Ana, <br />
                Illinois 85486
              </p>
              <p className="mb-3 bg-[#1e3a39] px-4 py-3 rounded-lg inline-block">
                + (123) 456–7890
              </p>
              <p className="bg-[#1e3a39] px-4 py-3 rounded-lg inline-block">
                Yourcompany@example.com
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Link</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>About Us</li>
                  <li>Our Team</li>
                  <li>Our Portfolio</li>
                  <li>Careers</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div className="pt-10 md:pt-12">
                <ul className="space-y-2 text-gray-300">
                  <li>Works</li>
                  <li>Expertise</li>
                  <li>Blog</li>
                  <li>Awards</li>
                </ul>
              </div>
            </div>

            {/* Our Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Solutions</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Web Development</li>
                <li>UI/UX Design</li>
                <li>Mobile Application</li>
                <li>Cloud Service</li>
                <li>Cyber Security</li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-end mt-10 space-x-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e3a39] hover:bg-[#E0A35F] transition">
              <RxCross2 />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e3a39] hover:bg-[#E0A35F] transition">
              <FaFacebookF />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e3a39] hover:bg-[#E0A35F] transition">
              <FaPinterestP />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e3a39] hover:bg-[#E0A35F] transition">
              <FaInstagram />
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-600 pt-6 text-center text-gray-400">
            Copyright © 2025 Finclix. All Rights Reserved
          </div>
        </div>
      </footer>
    </section>
  );
}
