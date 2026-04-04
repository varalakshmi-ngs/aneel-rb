"use client";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah D.",
      message:
        "The church community here is so warm and welcoming. Every event and service brings me closer to faith.",
      image: "/images/pastor1.webp",
    },
    {
      name: "John M.",
      message:
        "The gallery beautifully captures our togetherness. It’s amazing to relive those precious moments through photos.",
      image: "/images/pastor6.jpg",
    },
    {
      name: "Grace L.",
      message:
        "Every visit fills me with peace and gratitude. The love shared in this church is truly inspiring.",
      image: "/images/pastor7.avif",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="bg-[#F8FAFC] py-20 px-6 md:px-10 lg:px-16 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-5xl font-bold text-center text-[#022147]"
        >
          What People <span className="text-[#F74F22]">Say</span>
        </motion.h2>

        {/* Divider */}
        <div className="w-20 h-[3px] bg-[#F74F22] mx-auto mt-4 mb-12"></div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#e5e7eb]"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#022147]"
                />
              </div>
              <p className="text-[#022147] italic mb-4">“{t.message}”</p>
              <h4 className="text-[#F74F22] font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
