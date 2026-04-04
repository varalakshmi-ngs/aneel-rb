"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const contactInfo = [
  {
    icon: <MapPin className="w-10 h-10" />,
    title: "Address Line",
    details: ["Bowery St, New York, 37 USA", "NY 10013, USA"],
  },
  {
    icon: <Phone className="w-10 h-10" />,
    title: "Contact Numbers",
    details: ["+1255 – 568 – 6523 4374-221", "+1255 – 568 – 6523"],
  },
  {
    icon: <Mail className="w-10 h-10" />,
    title: "Mail Address",
    details: ["email@example.com", "info@yourdomain.com"],
  },
];

export default function Contact() {
  return (
    <section className="bg-[#ffff] text-[#022147] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            className="group relative rounded-2xl shadow-lg p-10 text-center transition-all duration-500"
            whileHover="hover"
            initial="initial"
            variants={{
              initial: { scale: 1, backgroundColor: "#06302f" },
              hover: { scale: 1.05, backgroundColor: "#0A3C3B" }, // ✅ background changes here
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <motion.div
              className="flex items-center justify-center mb-6 text-[#022147]"
              variants={{
                initial: { rotateY: 0 },
                hover: { rotateY: 180 },
              }}
              transition={{ duration: 0.6 }}
            >
              {item.icon}
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-4 group-hover:text-[#F74F22] transition-colors duration-500">
              {item.title}
            </h3>

            {/* Details */}
            {item.details.map((line, i) => (
              <p
                key={i}
                className="text-gray-300 group-hover:text-[#F74F22] transition-colors duration-500"
              >
                {line}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
