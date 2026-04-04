"use client";
import { motion } from "framer-motion";

export default function VisitUsSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="bg-white text-[#022147] py-20 px-6 md:px-10 lg:px-16 flex justify-center">
      <div className="w-full max-w-7xl text-center">
        {/* === Heading === */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-5xl font-bold"
        >
          Visit <span className="text-[#F74F22]">Our Church</span>
        </motion.h2>

        {/* Divider */}
        <div className="w-20 h-[3px] bg-[#F74F22] mx-auto mt-4 mb-10"></div>

        {/* === Description === */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-2xl mx-auto text-lg mb-12 text-[#022147]/80"
        >
          We welcome you to join our Sunday services and community gatherings.
          Experience peace, worship, and togetherness in the presence of God.
        </motion.p>

        {/* === Info Cards === */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10"
        >
          {/* Address Card */}
          <div className="bg-[#F8FAFC] p-8 rounded-2xl shadow-md w-full md:w-1/3 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-3">📍 Address</h3>
            <p>St. Mary’s Church<br />Hyderabad, Telangana, India</p>
          </div>

          {/* Service Timings Card */}
          <div className="bg-[#F8FAFC] p-8 rounded-2xl shadow-md w-full md:w-1/3 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-3">⏰ Service Timings</h3>
            <p>Sunday Morning: 9:00 AM – 11:00 AM<br />Evening Service: 6:00 PM – 7:30 PM</p>
          </div>

          {/* Contact Info Card */}
          <div className="bg-[#F8FAFC] p-8 rounded-2xl shadow-md w-full md:w-1/3 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-3">📞 Contact</h3>
            <p>Email: info@stmaryschurch.org<br />Phone: +91 98765 43210</p>
          </div>
        </motion.div>

        {/* === Map Embed === */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16"
        >
          <iframe
            title="church-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5121307646377!2d78.491684674489!3d17.38504408350581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99b3c74b2c49%3A0x40d7bb74c62bcb9!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1690885655174!5m2!1sen!2sin"
            width="100%"
            height="400"
            className="rounded-2xl border-0 shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
