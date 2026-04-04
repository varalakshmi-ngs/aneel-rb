"use client";

import CollaborationCard from "@/utils/CollaborationCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Collaborations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <section className="w-full bg-[#000000] text-white relative overflow-hidden py-20 px-6 md:px-16 lg:py-28 lg:px-24">
      {/* Rotating Globe - Client-only */}
      {mounted && (
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
            className="text-[#E0A35F] w-full h-full"
          >
            <circle cx="100" cy="100" r="95" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="95" ry="35" strokeWidth="1" />
            <ellipse cx="100" cy="100" rx="35" ry="95" strokeWidth="1" />
            <line x1="5" y1="100" x2="195" y2="100" strokeWidth="1" />
            <line x1="100" y1="5" x2="100" y2="195" strokeWidth="1" />
          </svg>
        </motion.div>
      )}

      {/* Section Heading */}
      <motion.div
        className="relative z-10 text-center max-w-6xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-[#E0A35F] text-sm md:text-base lg:text-lg font-medium uppercase mb-4 flex items-center justify-center gap-3"
        >
          <span className="inline-block w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-[#E0A35F]"></span>
          Our Collaborations
        </motion.p>

        {/* Main Title */}
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug mb-6"
        >
          Innovation with Industry Leaders
        </motion.h2>

      </motion.div>

      {/* Collaboration Cards */}
      <motion.div
        className="space-y-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        <motion.div variants={item}>
          <CollaborationCard
            logo="/images/logo1black.png"
            companyName="Nuhvin Global Services Pvt. Ltd."
            description="Nuhvin Global Services is a professional software company that provides innovative IT consultancy, application development, and business solutions to clients worldwide. We focus on quality, performance, and customer satisfaction."
            link="https://nuhvin.com/"
          />
        </motion.div>

        <motion.div variants={item}>
          <CollaborationCard
            logo="/images/infosys.png"
            companyName="Crystolyte Associates India Pvt Ltd"
            description="Crystolyte Associates india Pvt. Ltd is based in Hyderabad
              provides facility management services to corporate
              offices, shopping malls, corporate Hospital s, Gated
              communities, software companies,
              Five star hotels, Educational institutions, and all types of
              industries with strong and committed team.
"
            link="https://crystolyteindia.com/ "
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
