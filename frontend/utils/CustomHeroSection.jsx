"use client";

import { motion } from "framer-motion";

export default function CustomHeroSection({
  backgroundImage = "",
  headingLines = [],
  subHeadingLines = [],
}) {
  // Animation Variants
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // 🔥 Animated word "Businesses"
  const animatedWord = "Businesses".split("");

  return (
    <section
      className="relative bg-cover bg-center h-screen md:h-[600px] flex items-center justify-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <motion.div
        className="z-10 max-w-2xl text-center text-white px-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Heading */}
        <div className="mb-4">
          {headingLines.map((line, index) => {
            // Replace "Businesses" with animated version
            if (line.includes("Businesses")) {
              const parts = line.split("Businesses");
              return (
                <motion.h1
                  key={index}
                  variants={item}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight flex flex-wrap justify-center gap-1"
                >
                  {parts[0]}
                  <span className="flex bg-gradient-to-r from-[#C8F169] to-[#039397] bg-clip-text text-transparent">
                    {animatedWord.map((letter, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        animate={{
                          y: [0, -10, 10, 0], // bounce
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #C8F169, #039397)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                  {parts[1]}
                </motion.h1>
              );
            }
            // Normal heading
            return (
              <motion.h1
                key={index}
                variants={item}
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              >
                {line}
              </motion.h1>
            );
          })}
        </div>

        {/* Subheading */}
        <div className="mb-6 text-gray-100">
          {subHeadingLines.map((line, index) => (
            <motion.p
              key={index}
              variants={item}
              className="text-base sm:text-lg md:text-xl"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
