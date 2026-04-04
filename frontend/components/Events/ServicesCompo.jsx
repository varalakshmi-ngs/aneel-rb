"use client";

import { motion } from "framer-motion";
import { Briefcase, Folder, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
const services = [
  {
    id: "01",
    icon: Briefcase,
    title: "Business Consulting",
    desc: "Everyone with high and useful reward for his We offer a free consultation so that.",
    link: "/business-consulting", 
  },
  {
    id: "02",
    icon: Folder,
    title: "Invest Process",
    desc: "Everyone with high and useful reward for his We offer a free consultation so that.",
    link: "/invest-process",
  },
  {
    id: "03",
    icon: Layers,
    title: "IT Services",
    desc: "End-to-end IT services with software development, cloud solutions, tailored technical support.",
    link: "/it-services",
  },
];

export default function ServicesCompo() {
  return (
    <section className="text-[#F74F22] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        {services.map((service, index) => (
          <Link key={index} href={service.link} passHref>
            <div className="relative bg-[#022147] text-[#F74F22] rounded-lg shadow-md p-8 overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
              {/* Top Row: Icon and Number */}
              <div className="flex items-center gap-10 mb-6">
                {/* Folded Icon Box */}
                <div className="relative w-14 h-14 bg-[#F74F22] flex items-center justify-center rounded-sm">
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center"
                  >
                    <service.icon className="w-6 h-6 text-[#022147]" />
                  </motion.div>
                </div>

                {/* Number Section */}
                <div className="text-5xl font-extrabold text-gray-300 opacity-90">
                  {service.id}
                </div>
              </div>

              {/* Content */}
              <div className="text-justify">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-[#F74F22]">{service.desc}</p>
              </div>

              {/* Animated bottom-right triangles */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-60"
                animate={{ x: [0, 10, 0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/arrow-shape.png"
                  alt="pattern"
                  width={60}
                  height={60}
                />
              </motion.div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
