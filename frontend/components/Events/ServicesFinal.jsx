"use client";
import React from "react";
import { motion } from "framer-motion";
import ServicesCompo from "./ServicesCompo";
import ServicesCompo2 from "./ServicesCompo2";

export default function ServicesFinal() {
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="bg-[#0F2727] text-white py-20 px-6 md:px-16 lg:py-28 lg:px-24">
      <motion.div
        className="relative z-10 text-center max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        {/* Section Tagline */}
        <motion.p
          variants={item}
          className="text-green-300 text-sm md:text-base lg:text-lg font-medium uppercase mb-4 flex items-center justify-center gap-3"
        >
          <span className="inline-block w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-green-400"></span>
          What We Do
        </motion.p>

        {/* Section Heading */}
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug mb-10 px-2 lg:px-0"
        >
          We Cover All Business Services
        </motion.h2>
      </motion.div>

      {/* Services Components */}
      <ServicesCompo />
      <ServicesCompo2 />
    </div>
  );
}
