"use client";
import { motion } from "framer-motion";
import ServicesCompo from "../Events/ServicesCompo";
import { ArrowRight } from "lucide-react";

export default function WhatWeDo() {
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
        <section className="w-full bg-[#ffff] text-[#022147] relative overflow-hidden py-20 px-6 md:px-16 lg:py-28 lg:px-24">
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
                    className="text-[#F74F22] w-full h-full"
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
                    className="text-[#F74F22] text-sm md:text-base lg:text-lg font-medium uppercase mb-4 flex items-center justify-center gap-3"
                >
                    <span className="inline-block w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-[#F74F22]"></span>
                    What We Do
                </motion.p>

                <motion.h2
                    variants={item}
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug mb-2 lg:mb-0 px-2 lg:px-0"
                >
                    We Cover All Business Services
                </motion.h2>

                <ServicesCompo />
                {/* Bottom Highlight Box */}
                <div className="bg-gradient-to-r from-[#022147]  to-[#f1b878] text-black rounded-full py-4 px-6 flex items-center justify-center gap-3 font-medium max-w-3xl mx-auto">
                    <span className="bg-black text-[#F74F22] rounded-full p-2">
                        <ArrowRight className="w-5 h-5" />
                    </span>
                    <span>
                        We Strive To Lead The Way In The Business{" "}
                        <a href="/services" className="underline font-semibold">
                            Know All Services
                        </a>
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
