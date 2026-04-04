"use client";
import { useState } from "react";

import { motion } from "framer-motion";

const teamMembers = [
  { name: "Guy Hawkins", role: "pastor", image: "/images/pastor5.jpg" },
  { name: "Jacob Jones", role: "Manager", image: "/images/pastor2.jpeg" },
  { name: "Kristin Watson", role: "Consultant", image: "/images/pastor3.jpg" },
  { name: "Bessie Cooper", role: "Founder", image: "/images/pastor4.jpg" },
];

export default function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Container animation for section
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  // Card entrance animation
  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <section className="bg-[#ffff] py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-wide font-medium flex items-center justify-center gap-2 text-[#F74F22] text-sm lg:text-base">
          <span className="text-[#F74F22] text-lg">+</span>
          <span className="font-bold">Our Ministry Team</span>
        </p>


        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#022147] mt-3 leading-snug">
          Guiding You with  <br className="hidden sm:block" /> Faith and Compassion
        </h2>
      </div>

      {/* Team Grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            variants={item}
            className="relative bg-[#022147] rounded-2xl shadow-lg overflow-hidden group cursor-pointer transition-all"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Image with hover slide */}
            <motion.img
              src={member.image}
              alt={member.name}
              className="w-full h-64 sm:h-72 lg:h-80 object-cover"
              initial={{ x: 50 }}
              animate={{ x: activeIndex === index ? 0 : 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />

            {/* Cross Icon Overlay */}
            <img
              src="/images/cross.png"
              alt="cross"
              className="absolute top-3 left-3 w-6 h-6 sm:w-7 sm:h-7"
            />



            {/* Footer Info */}
            <div className="bg-[#022147] p-4 sm:p-5 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">
                  {member.name}

                </h3>
                <p className="text-[#F74F22] text-xs sm:text-sm">
                  {member.role}
                </p>
              </div>
              {/* Cross Icon on right side */}
              <img
                src="/images/cross.png"
                alt="cross"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />


            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
