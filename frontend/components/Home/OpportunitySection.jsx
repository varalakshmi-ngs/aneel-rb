"use client";
import { motion } from "framer-motion";

export default function OpportunitySection() {
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
      transition: { type: "spring", stiffness: 100, damping: 20, ease: "easeInOut" },
    },
  };

  return (
    <section className="w-full bg-[#052826] text-white relative overflow-hidden py-20 px-6 md:px-16 lg:py-28 lg:px-24">
      {/* Rotating Globe SVG - Bottom Right */}
      <motion.div
        className="absolute bottom-0 right-0 opacity-20 w-64 h-64 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 200 200"
          stroke="currentColor"
          className="text-green-300 w-full h-full"
        >
          <circle cx="100" cy="100" r="95" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="95" ry="35" strokeWidth="1" />
          <ellipse cx="100" cy="100" rx="35" ry="95" strokeWidth="1" />
          <line x1="5" y1="100" x2="195" y2="100" strokeWidth="1" />
          <line x1="100" y1="5" x2="100" y2="195" strokeWidth="1" />
        </svg>
      </motion.div>

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
          How It Work
        </motion.p>

        {/* Heading */}
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug mb-14 lg:mb-16 px-2 lg:px-0"
        >
          Connect, Collaborate, & Create <br /> Limitless Opportunities.
        </motion.h2>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 border border-gray-700 rounded-2xl p-6 md:p-8 lg:p-10"
          variants={container}
        >
          {/* Step 1 */}
          <motion.div
            variants={item}
            className="text-center md:text-left border-r border-gray-700 last:border-none group hover:cursor-pointer p-4 lg:p-6"
          >
            <p className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
              01
            </p>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-3">Strategic Growth</h3>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg">
              Sparking Innovation, Shaping <br /> Tomorrow successful
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={item}
            className="text-center md:text-left border-r border-gray-700 last:border-none group hover:cursor-pointer p-4 lg:p-6"
          >
            <p className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
              02
            </p>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-3">Fuel Innovation</h3>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg">
              Sparking Innovation, Shaping <br /> Tomorrow successful
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={item}
            className="text-center md:text-left border-r border-gray-700 last:border-none group hover:cursor-pointer p-4 lg:p-6"
          >
            <p className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
              03
            </p>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-3">Financial Planning</h3>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg">
              Helping You Stay on Track <br /> with Accurate Estimates
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            variants={item}
            className="text-center md:text-left group hover:cursor-pointer p-4 lg:p-6"
          >
            <p className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
              04
            </p>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-3">Sustainable Success</h3>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg">
              Amazing Support! with lot of <br /> ele demos to choose from top
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Line */}
        <motion.p variants={item} className="mt-10 text-lg md:text-xl lg:text-2xl font-semibold px-2 lg:px-0">
          Embrace Innovation, Adapt Quickly, and Lead with Confidence.{" "}
          <span className="text-green-400 cursor-pointer">Consult Now</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
