"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Homepage2() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  const openPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };
  const closePopup = () => setShowPopup(false);

  // ✨ Card Animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // ✨ Popup Animation
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <section className="py-20 bg-[#ffffff] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 gap-10 lg:gap-14">
        {/* ===== Morning Prayer Card ===== */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ rotate: 0 }}
          className="group bg-white border border-gray-200 rounded-lg shadow-sm text-center p-10 hover:shadow-lg transition duration-300"
        >
          <div className="flex flex-col items-center">
            <div
              onClick={() => openPopup("cross")}
              className="relative flex items-center justify-center w-24 h-24 rounded-full border border-gray-200 mb-5 cursor-pointer"
            >
              <Image
                src="/images/cross.png"
                alt="Morning Prayer"
                width={48}
                height={48}
                className="object-contain text-[#F74F22]"
              />

              {/* 🔸 Rotating Dots on Hover */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <span className="absolute top-1 right-1 w-3 h-3 bg-[#F74F22] rounded-full"></span>
                <span className="absolute bottom-1 left-1 w-3 h-3 bg-[#F74F22] rounded-full"></span>
              </motion.div>
            </div>

            <h3 className="text-[#022147] text-2xl font-bold mb-3">
              Morning Prayer
            </h3>
            <p className="text-gray-500 text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do
              eiusmod.
            </p>
          </div>
        </motion.div>

        {/* ===== Counseling Card ===== */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="group bg-[#022147] text-white rounded-lg shadow-sm text-center p-10 hover:shadow-lg transition duration-300"
        >
          <div className="flex flex-col items-center">
            <div
              onClick={() => openPopup("church")}
              className="relative flex items-center justify-center w-24 h-24 rounded-full border border-white mb-5 cursor-pointer"
            >
              <Image
                src="/images/chruchlogo.png"
                alt="Counseling"
                width={48}
                height={48}
                className="object-contain"
              />

              {/* 🔸 Rotating Dots on Hover */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ rotate: -45 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <span className="absolute top-1 right-1 w-3 h-3 bg-[#F74F22] rounded-full"></span>
                <span className="absolute bottom-1 left-1 w-3 h-3 bg-[#F74F22] rounded-full"></span>
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold mb-3">Counseling</h3>
            <p className="text-gray-300 text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do
              eiusmod.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===== Popup Modal (Animated) ===== */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#022147] text-white rounded-lg p-8 w-[90%] sm:w-[450px] relative shadow-xl"
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-3 right-4 text-white text-2xl font-bold hover:text-[#F74F22]"
              >
                ×
              </button>

              {/* Header */}
              <h2 className="text-[#F74F22] text-xl font-bold mb-4 text-center">
                {popupType === "cross"
                  ? "Join Morning Prayer"
                  : "Connect with Counseling"}
              </h2>

              {/* Form */}
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full bg-transparent border border-gray-400 rounded-md px-4 py-2 placeholder-gray-300 focus:outline-none focus:border-[#F74F22]"
                />
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full bg-transparent border border-gray-400 rounded-md px-4 py-2 placeholder-gray-300 focus:outline-none focus:border-[#F74F22]"
                />
                <textarea
                  placeholder="Enter Message"
                  className="w-full bg-transparent border border-gray-400 rounded-md px-4 py-2 placeholder-gray-300 focus:outline-none focus:border-[#F74F22]"
                ></textarea>
                <button
                  type="button"
                  className="w-full bg-[#F74F22] text-white font-semibold py-2 rounded-md hover:bg-[#d93f1c] transition"
                >
                  START SAVING TODAY
                </button>
              </form>

            
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
