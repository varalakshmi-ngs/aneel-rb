"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function Testimonials() {
  const testimonials = useMemo(() => [
    {
      id: 1,
      text: "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus.",
      author: "Bobby K. Parker",
      images: [
        "/images/chruch-01.jpg",
        "/images/jesus.jpg",
        "/images/chruch-02.png",
        "/images/chruch-03.webp",
        "/images/chruch-04.jpg",
        "/images/chruch-05.jpg",
      ],
    },
  ], []);

  const [index, setIndex] = useState(0);

  // Auto change every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials[0].images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Get the 3 images: left, center, right
  const getImages = () => {
    const imgs = testimonials[0].images;
    const center = imgs[index];
    const left = imgs[(index - 1 + imgs.length) % imgs.length];
    const right = imgs[(index + 1) % imgs.length];
    return [left, center, right];
  };

  const visibleImages = getImages();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">

        {/* ===== Left Text Section ===== */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="uppercase tracking-wide font-medium flex items-center space-x-2 text-[#F74F22] text-sm lg:text-base">
            <span className="text-[#F74F22] text-lg">+</span>
            <span className="font-bold">TESTIMONIALS</span>
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold text-[#022147] mb-6 leading-tight">
            What Our Members Say
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We are a church that believes in Jesus Christ and the followers and We are a church that believes in Jesus Christ.
            This is where you should start. Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod.
            Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod.
          </p>
        </motion.div>

        {/* ===== Right Testimonial Section ===== */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#022147] rounded-md p-10 relative overflow-hidden"
        >
          <div>
            {/* === Image Row with Animation === */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {visibleImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: i === 1 ? 1.2 : 0.9, // middle bigger
                    opacity: 1,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`relative overflow-hidden rounded-md ${i === 1 ? "w-36 h-36 z-10" : "w-28 h-28 opacity-80"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`testimonial-${i}`}
                    fill
                    className="object-cover transition-all duration-700"
                  />
                </motion.div>
              ))}
            </div>

            {/* === Quote & Text === */}
            <Quote className="text-[#F74F22] w-10 h-10 mb-4" />
            <p className="text-white text-lg leading-relaxed mb-6">
              {testimonials[0].text}
            </p>
            <p className="text-white font-semibold">
              {testimonials[0].author}
            </p>

            {/* === Pagination Dots === */}
            <div className="flex gap-3 mt-8 justify-end">
              {testimonials[0].images.map((_, i) => (
                <span
                  key={i}
                  className={`w-8 h-1 rounded-full transition-all duration-300 ${i === index ? "bg-[#F74F22]" : "bg-gray-400"
                    }`}
                ></span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
