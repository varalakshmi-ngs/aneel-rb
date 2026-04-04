"use client";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How Can Business Consulting Benefit My Company?",
    answer: "Business consulting helps optimize processes, increase revenue, and provide expert insights tailored to your company's needs.",
  },
  {
    question: "What Are the Costs of Your Consulting Services?",
    answer: "It is widely recognized that a reader's attention can be diverted by the content layout of a page. Many desktop publishing software and website editors now use Lorem Ipsum as placeholder text.",
  },
  {
    question: "How Do You Measure the Success of a Project?",
    answer: "We track KPIs, milestones, and ROI metrics to ensure every project meets its goals efficiently.",
  },
  {
    question: "Do You Provide Remote Consulting Services?",
    answer: "Yes, we provide remote consulting through video calls, emails, and project management tools.",
  },
  {
    question: "What Industries Do You Specialize In?",
    answer: "We specialize in technology, finance, healthcare, and small-to-medium enterprises.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="bg-[#000000] py-16 px-4 md:px-8 lg:px-12 text-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start"
      >
        {/* Top Image */}
        <motion.div variants={item} className="w-full md:w-1/2">
          <img
            src="/images/image.jpg"
            alt="Business Consulting"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Content + FAQ */}
        <motion.div variants={item} className="w-full md:w-1/2 flex flex-col gap-8">
          <motion.div variants={item}>
            <p className="text-[#E0A35F] font-semibold flex items-center gap-2 mb-2">
              <span className="text-[#E0A35F]">▶</span> FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Questions Answered</h2>
            <p className="text-gray-300 max-w-md">
              Everyone with high and useful reward for his Financial statement analysis, Cost-benefit analysis.
            </p>
            <button className="mt-6 bg-gradient-to-r from-[#de8f34] to-[#E0A35F] text-black px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition">
              Lets Talk With Us <IoIosArrowForward />
            </button>
          </motion.div>

          {/* FAQ List */}
          <motion.div variants={container} className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="bg-[#7d5324] rounded-lg p-4 cursor-pointer"
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <span className={`transform transition-transform ${activeIndex === idx ? "rotate-90" : ""}`}>
                    <IoIosArrowForward />
                  </span>
                </div>
                {activeIndex === idx && (
                  <p className="text-gray-300 mt-2">{faq.answer}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
