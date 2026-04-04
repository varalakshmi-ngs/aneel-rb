"use client";
import { motion } from "framer-motion";

export default function GalleryList({ galleryItems = [] }) {
  const defaultGalleryImages = [
    "/images/image.png",
    "/images/chruch-01.jpg",
    "/images/chruch-02.png",
    "/images/chruch-03.webp",
    "/images/chruch-04.jpg",
    "/images/chruch-05.jpg",
    "/images/chruch-06.jpg",
    "/images/chruch-07.jpg",
  ];

  const items = galleryItems.length
    ? galleryItems
    : defaultGalleryImages.map((src) => ({ image_url: src }));

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // Each card loads one by one
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="w-full flex justify-center bg-[#ffff] px-6 md:px-10 lg:px-16 py-16">
      <div className="w-full max-w-7xl">
        {/* Animated Heading */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="uppercase tracking-wide font-medium flex items-center justify-center space-x-2 text-[#F74F22] text-sm lg:text-base mb-4"
        >
          <span className="text-[#F74F22] text-lg">+</span>
          <span className="font-bold">Our Gallery</span>
        </motion.h2>



        {/* Animated Tagline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-[#022147]  mt-4 mb-12 max-w-2xl mx-auto"
        >
          Explore our gallery showcasing highlights of our work, projects, and
          events. Witness creativity, innovation, and excellence captured in every image.
        </motion.p>

        {/* Animated Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {items.map((img, idx) => (
            <motion.div
              key={idx}
              variants={cardVariant}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-[#022147]  rounded-2xl shadow-lg overflow-hidden p-4"
            >
              <motion.img
                src={img.image_url || img.img || img}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
