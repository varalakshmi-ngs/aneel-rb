"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CollaborationCard({
  logo,
  companyName,
  description,
  link,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto bg-[#0b3d3d] backdrop-blur-lg border border-[#0b3d3d] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 text-white min-h-[400px] md:min-h-[350px]"
    >
      {/* Left Section - Logo */}
      <div className="flex-shrink-0 bg-[#0b3d3d] p-4 sm:p-6 md:p-6 rounded-2xl flex justify-center items-center w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56">
        <Image
          src={logo}
          alt={`${companyName} Logo`}
          width={180}
          height={180}
          className="object-contain"
        />
      </div>

      {/* Right Section - Content */}
      <div className="flex-1 text-center md:text-left px-4 sm:px-6 md:px-10 py-4 space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          {companyName}
        </h2>

        <p className="text-gray-300 text-base sm:text-lg md:text-lg leading-relaxed max-w-full md:max-w-2xl">
          {description}
        </p>

        <div className="mt-6 sm:mt-8">
          <div className="bg-gradient-to-r from-green-400 to-green-300 text-black rounded-full py-4 px-6 sm:py-5 sm:px-8 flex flex-row items-center gap-4 font-medium w-full md:max-w-3xl">
            {/* Arrow on the left */}
            <span className="bg-black text-green-300 rounded-full p-2 sm:p-3 flex-shrink-0 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>

            {/* Text on the right */}
            <span className="text-sm sm:text-base md:text-lg">
              Discover how we empower businesses{" "}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-green-800"
              >
                Know More About Us
              </a>
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
