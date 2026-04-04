"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getApiBase } from "../utils/apiBase";

export default function Pastors() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastors = async () => {
      try {
        const res = await fetch(`${getApiBase()}/church-pastors`);
        if (res.ok) {
          let data = await res.json();
          data = data.filter(p => p.is_active === 1 || p.is_active === true);
          setTeam(data.map(p => ({
            name: p.name,
            role: p.role || "Pastor",
            img: p.image_url || "/images/pastor3.jpg",
          })));
        }
      } catch (err) {
        console.error("Failed to fetch pastors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPastors();
  }, []);

  // Animation container & item
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.3 },
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
    <section className="w-full flex justify-center bg-[#ffff] px-6 md:px-10 lg:px-16 py-16">
      <div className="w-full max-w-7xl">
        {/* Section Heading with Animation */}
        <motion.div
          className="relative z-10 text-center max-w-6xl mx-auto mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          {/* Section Tagline */}
          <motion.p
            variants={item}
            className="uppercase tracking-wide font-medium flex items-center justify-center space-x-2 text-[#F74F22] text-sm lg:text-base mb-4"
          >
            <span className="text-[#F74F22] text-lg">+</span>
            <span className="font-bold">Our Pastors</span>
          </motion.p>

          {/* Section Title */}
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug text-[#022147] px-2 lg:px-0"
          >
            Meet Our <span className="text-[#022147]">Pastors</span>
          </motion.h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-[#022147] rounded-2xl overflow-hidden shadow-lg group"
            >
              {/* Image with constrained size */}
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-52 sm:h-56 md:h-60 object-cover transform group-hover:scale-105 transition duration-500 rounded-2xl"
                />
              </div>

              {/* Info Section (✅ Cross icons added beside name) */}
              <div className="p-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <img src="/images/cross.png" alt="cross" className="w-8 h-8" />
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <img src="/images/cross.png" alt="cross" className="w-8 h-8" />
                </div>
                <p className="text-[#E0A35F] text-sm mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
