"use client";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import Image from "next/image";

export default function CustomFaqSection({ faqs = [], imageSrc }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#062522] py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* ==== Left: FAQs ==== */}
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-700 py-4 sm:py-5 lg:py-6"
            >
              <button
                className="flex justify-between items-center w-full text-left gap-4"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-snug">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiMinus className="text-green-300 text-xl sm:text-2xl" />
                ) : (
                  <FiPlus className="text-green-300 text-xl sm:text-2xl" />
                )}
              </button>

              {openIndex === index && (
                <p className="mt-2 sm:mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ==== Right: Image ==== */}
        <div className="relative w-full h-80 sm:h-96 lg:h-full rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt="FAQ illustration"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
