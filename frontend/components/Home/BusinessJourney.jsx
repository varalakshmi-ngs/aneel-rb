"use client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessJourney({ aboutSection }) {
  const renderSubtitle = aboutSection?.subtitle || "We Have 25+ Years of Experience";
  const renderTitle = aboutSection?.title || "We Are A Church \n That Believes In God.";
  const renderDesc = aboutSection?.description || "We are a church that believes in Jesus Christ and the followers and we are a church that believes in Jesus Christ.";
  const renderImage = aboutSection?.image_url || "/images/image.png";

  // Left side animation (top to bottom)
  const leftContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  const leftItem = {
    hidden: { opacity: 0, y: -40, scale: 0.95 },
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

  // Right side animation (bottom to top)
  const rightContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } },
  };

  const rightItem = {
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
    <section className="bg-[#ffffff] text-[#022147] py-16 px-6 md:px-12">
      {/* ✅ Desktop: text left, image right | Mobile: text first, image second */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 lg:gap-36 items-center">

        {/* ==== LEFT SIDE: Text Content ==== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={rightContainer}
          className="order-1 md:order-1"
        >
          {/* Top line */}
          <motion.p
            variants={rightItem}
            className="uppercase tracking-wide font-medium flex items-center space-x-2 text-[#F74F22] text-sm lg:text-base"
          >
            <span className="text-[#F74F22] text-lg">+</span>
            <span className="font-bold">{renderSubtitle}</span>
          </motion.p>

          {/* Main heading */}
          <motion.h2
            variants={rightItem}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 leading-tight text-[#022147]"
          >
            {renderTitle.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i !== renderTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={rightItem}
            className="mt-6 text-[#022147] text-base sm:text-lg leading-relaxed flex items-start gap-4"
          >
            <Image
              src="/images/cross.png"
              alt="Church Logo"
              width={40}
              height={40}
              className="object-contain mt-1"
            />
            {renderDesc}
          </motion.p>

          {/* Info Boxes */}
          <motion.div
            variants={rightItem}
            className="mt-8 flex flex-col sm:flex-row gap-10"
          >
            {/* Helping Hand */}
            <div className="flex flex-col items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-[#F74F22]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#F74F22"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2L2 7l10 5 10-5-10-5zm0 13l-10-5v7l10 5 10-5v-7l-10 5z"
                />
              </svg>
              <h3 className="text-xl font-semibold mt-3 text-[#022147]">
                Helping Hand
              </h3>
              <p className="text-[#022147] mt-2 text-sm">
                Vestibulum ac diam sit amet quam vehicula elementum sed.
              </p>
            </div>

            {/* Open Hearts */}
            <div className="flex flex-col items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-[#F74F22]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#F74F22"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21C12 21 4 13 4 8a4 4 0 0 1 8 0c0 5-8 13-8 13zM12 21c0 0 8-8 8-13a4 4 0 0 0-8 0c0 5 8 13 8 13z"
                />
              </svg>
              <h3 className="text-xl font-semibold mt-3 text-[#022147]">
                Open Hearts
              </h3>
              <p className="text-[#022147] mt-2 text-sm">
                Vestibulum ac diam sit amet quam vehicula elementum sed.
              </p>
            </div>
          </motion.div>

          {/* Learn More Button */}
          <motion.div variants={rightItem} className="mt-10">
            <a
              href="/aboutus"
              className="inline-flex items-center justify-center bg-[#ffffff] border border-[#022147] text-[#022147] font-semibold px-6 py-3 rounded-md hover:bg-[#F74F22] hover:text-white transition"
            >
              Learn More <ArrowUpRight size={18} className="ml-2" />
            </a>
          </motion.div>
        </motion.div>

        {/* ==== RIGHT SIDE: Image + Pastor Section ==== */}
        <motion.div
          className="relative flex flex-col items-center order-2 md:order-2"
          variants={leftContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="relative flex flex-col items-center"
            variants={leftItem}
          >
            {/* Image */}
            <div className="relative w-64 sm:w-80 md:w-[26rem] lg:w-[32rem] h-64 sm:h-80 md:h-[26rem] lg:h-[35rem] rounded-xl overflow-hidden border-2 border-[#022147] shadow-lg">
              <Image
                src={renderImage}
                alt="Business meeting"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 40vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
