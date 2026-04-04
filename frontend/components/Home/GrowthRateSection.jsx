"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function GrowthRateSection() {
  const stats = [
    {
      value: "90%",
      title: "Scalable Solutions",
      desc: "End to end fiber optic cable connectivity for stable",
    },
    {
      value: "95%",
      title: "Automation Features",
      desc: "End to end fiber optic cable connectivity for stable",
    },
    {
      value: "100%",
      title: "24/7 Support",
      desc: "End to end fiber optic cable connectivity for stable",
    },
  ];

  // Container for staggering child animations
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3, // Each child appears 0.3s after previous
      },
    },
  };

  // Individual item animation
  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, ease: "easeInOut" },
    },
  };

  return (
    <section className="w-full flex justify-center bg-[#052B2B] px-4 md:px-8 lg:px-12">
      <div className="relative w-full max-w-7xl rounded-3xl overflow-hidden py-16 px-6 md:px-12 lg:px-16 text-white">
        {/* Background Image + Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/growth-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,68,67,0)_0%,#144443_100%)]"></div>
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          {/* Top Label */}
          <motion.p variants={item} className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-4">
            <span className="text-lg">▸</span> Growth Rate
          </motion.p>

          {/* Heading + Button */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-snug max-w-3xl">
              Building Connections for grow <br /> Limitless Opportunities.
            </h2>
            <button className="bg-gradient-to-r from-green-400 to-green-500 text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition">
              Lets Talk With Us
              <span className="bg-black text-green-400 rounded-full p-2">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </button>
          </motion.div>

          {/* Divider Line */}
          <motion.div variants={item} className="border-b border-gray-500/40 mt-10 mb-10"></motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={container}
          >
            {stats.map((itemStat, idx) => (
              <motion.div key={idx} variants={item} className="flex flex-col items-center">
                {/* Circle Progress */}
                <div className="relative w-28 h-28 mb-4">
                  {/* Inner Circle with spacing from border */}
                  <div className="absolute inset-3 rounded-full bg-gradient-to-b from-green-300 to-green-600 flex items-center justify-center text-xl font-bold">
                    {itemStat.value}
                  </div>
                  {/* Outer Border Circle */}
                  <div className="absolute inset-0 rounded-full border-[6px] border-green-700 opacity-50"></div>
                </div>
                <h3 className="font-semibold text-lg">{itemStat.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{itemStat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
