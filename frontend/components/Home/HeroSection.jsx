"use client";

import { ArrowUpRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const slides = [
    { id: 1, heading: "Sharpen Your Edge with Our Expertise" },
    { id: 2, heading: "Best Facility Management Services in India" },
    { id: 3, heading: "Innovative Business Consulting Solutions" },
    { id: 4, heading: "Trusted Investment Process Management" },
    { id: 5, heading: "Strategic Investment Growth Solutions" },
    { id: 6, heading: "Smarter Business Decision Strategies" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const wordsPerSlide = 3; // Flip 3 times before next slide

  // Flip words every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setFlipCount((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // After 3 flips → change slide
  useEffect(() => {
    if (flipCount > 0 && flipCount % wordsPerSlide === 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [flipCount, slides.length]);

  return (
    <section className="bg-[#0F2727] lg:h-[100vh] p-8 lg:mt-2 overflow-hidden">
      <div
        className="h-full w-full flex items-center justify-center gap-10 lg:gap-48 lg:px-8 px-4 flex-col lg:flex-row 
        bg-none lg:bg-[url('/images/hero-bg.png')] lg:bg-center lg:bg-cover lg:bg-no-repeat"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.42, 0, 0.58, 1], // smooth easeInOut cubic
            }}
            className="flex flex-col lg:flex-row items-center justify-center w-full gap-10 lg:gap-48"
          >
            <LeftContent heading={slides[currentSlide].heading} />
            <RightContent />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function LeftContent({ heading }) {
  const texts = ["Anything", "Anytime", "Anywhere"];
  const [index, setIndex] = useState(0);

  // Rotate text every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [texts.length]);

  const flipVariants = {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
  };

  return (
    <motion.div
      className="space-y-6 mt-20 lg:mt-0"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {/* Heading */}
      <h1 className="text-white flex flex-col text-3xl lg:text-5xl font-semibold leading-snug text-center lg:text-left">
        <span>{heading}</span>
      </h1>

      {/* ✅ Replaced Animation Section */}
      <div className="h-10 md:h-12 overflow-hidden perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="inline-block text-2xl lg:text-5xl font-medium bg-gradient-to-r from-[#C8F169] to-[#039397] bg-clip-text text-transparent"
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Circle with AtoZ */}
      <div className="flex items-center gap-2 z-20 relative">
        <div className="absolute hidden lg:flex right-0 -top-[40px] bg-[#C8F169] rounded-full items-center justify-center">
          <img src="/images/text-circle.png" alt="" className="spin-slow-custom" />
          <motion.span
            className="absolute font-bold text-lg lg:text-xl text-black"
            animate={{
              opacity: [0.5, 1, 0.5],
              textShadow: [
                "0 0 2px #C8F169, 0 0 5px #C8F169",
                "0 0 5px #C8F169, 0 0 10px #C8F169",
                "0 0 2px #C8F169, 0 0 5px #C8F169",
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            AtoZ
          </motion.span>
        </div>
      </div>

      {/* Button */}
      <div className="w-full flex lg:block items-center justify-center lg:justify-start mt-6">
        <button className="relative w-[250px] overflow-hidden rounded-full group bg-[#ffffff1a] cursor-pointer">
          <span className="absolute inset-0 bg-[#C8F169] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>

          <span className="relative z-10 flex items-center justify-center p-4 text-white group-hover:text-black transition-colors duration-500">
            <span className="flex-1 text-center">Let&apos;s Talk with Us</span>
            <span className="absolute right-[5px] bg-[#C8F169] p-3 rounded-full group-hover:bg-white transition-colors duration-500">
              <ArrowUpRight color="black" />
            </span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// ✅ RightContent
function RightContent() {
  return (
    <div className="relative mt-4 lg:mt-0 flex justify-center items-center">
      <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-64 h-52 lg:w-[200px] lg:h-[300px] bg-[#C8F169] opacity-30 rounded-l-full filter blur-3xl pointer-events-none"></div>

      <div className="lg:h-[800px] lg:w-full relative z-10">
        <img
          src="/images/heroimg.png"
          className="h-full w-full object-contain"
          alt="Hero"
        />
      </div>
    </div>
  );
}
