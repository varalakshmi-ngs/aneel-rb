"use client";

import { motion } from "framer-motion";
import { Laptop, Smartphone, Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 

const services = [
  {
    id: "04",
    icon: Laptop,
    title: "Online Training",
    desc: "Interactive and practical online training programs designed to upskill teams and individuals with the latest technologies.",
    link: "/online-training", 
  },
  {
    id: "05",
    icon: Smartphone,
    title: "Mobile Solutions",
    desc: "Custom mobile app development and innovative solutions to help businesses connect with customers on the go,drive growth.",
    link: "/mobile-solutions",
  },
  {
    id: "06",
    icon: Code,
    title: "Facility Management Services",
    desc: "End-to-end application development services with modern frameworks, scalable architecture, and seamless user experiences.",
    link: "/facility-management",
  },
];

export default function ServicesCompo2() {
  return (
    <section className="text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        {services.map((service, index) => (
          <Link key={index} href={service.link} passHref>
            <div className="relative bg-white text-[#0F2727] rounded-lg shadow-md p-8 overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
              {/* Top Row: Icon and Number */}
              <div className="flex items-center gap-10 mb-6">
                {/* Folded Icon Box */}
                <div className="relative w-14 h-14 bg-[#06302f] flex items-center justify-center rounded-sm">
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center"
                  >
                    <service.icon className="w-6 h-6 text-green-400" />
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
                <p className="mt-2 text-gray-600">{service.desc}</p>
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
