"use client";
import Image from "next/image";
import { useState } from "react";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

// Dummy data
const testimonials = [
  {
    name: "Jacob Jones",
    role: "Business Owner",
    text: "Ascend the mountain not to plant your flag, but to embrace the challenge, savour the journey, and marvel at the view. Climb to experience the world, not for the world to notice you. This is why they stand out with exceptional",
    image: "/images/infosys.png",
  },
  {
    name: "Emily Carter",
    role: "Entrepreneur",
    text: "Success is not about the destination, but the growth you achieve along the way. Their work inspires me to keep climbing higher every day.",
    image: "/images/logo1black.png",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const { name, role, text, image } = testimonials[current];

  return (
    <section className="relative py-16 bg-[#002d2d] text-white">
      {/* Background world map */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/mask-shape.png')] bg-cover bg-center"></div>

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left - Profile */}
        <div className="relative flex flex-col items-center md:items-start">
          <div className="relative">
            <Image
              src={image}
              alt={name}
              width={200}
              height={200}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-green-600 w-10 h-10 rounded-full flex items-center justify-center">
              <FaQuoteRight className="text-white text-lg" />
            </div>
          </div>

          {/* Stars */}
          <div className="mt-6 flex items-center bg-[#002d2d] border rounded-full px-6 py-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-orange-400 text-lg" />
            ))}
          </div>
        </div>

        {/* Right - Text */}
        <div className="flex-1">
          <p className="text-lg leading-relaxed">{text}</p>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-10 flex gap-4">
        <button
          onClick={prevTestimonial}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <MdArrowBackIos />
        </button>
        <button
          onClick={nextTestimonial}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600"
        >
          <MdArrowForwardIos />
        </button>
      </div>
    </section>
  );
}
