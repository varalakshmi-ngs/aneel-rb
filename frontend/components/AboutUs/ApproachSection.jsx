"use client";

import Image from "next/image";
import { Church, User, Cross } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ApproachSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ===== LEFT CONTENT ===== */}
        <div>
          <div className="uppercase tracking-wide font-medium flex items-center space-x-2 text-[#F74F22] text-sm lg:text-base mb-4">
            <span className="text-[#F74F22] text-lg">+</span>
            <span className="font-bold">Our Approach</span>
          </div>


          <h2 className="text-4xl md:text-5xl font-extrabold text-[#022147] leading-tight mb-4">
            Advancing Regime&apos;s <br /> Domestic and Foreign
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed border-l-4 border-[#F74F22] pl-4">
            We are a church that believes in Jesus Christ and the followers, and we are a
            church that believes in Jesus Christ.
          </p>

          {/* ===== ICON BUTTONS ===== */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/Events"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFF5F2] border border-[#F74F22]/30 text-[#022147] font-semibold rounded-xl hover:bg-[#F74F22] hover:text-white transition-all"
            >
              <Cross size={20} />
              Events
            </Link>

            <Link
              href="/Members"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFF5F2] border border-[#F74F22]/30 text-[#022147] font-semibold rounded-xl hover:bg-[#F74F22] hover:text-white transition-all"
            >
              <Church size={20} />
              PccMembers
            </Link>

            <Link
              href="/Pastors"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFF5F2] border-b-2 border-[#F74F22] text-[#022147] font-semibold rounded-xl hover:bg-[#F74F22] hover:text-white transition-all">
              <User size={20} />
              Pastors
            </Link>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Curabitur aliquet quam id dui posuere blandit. Praesent sapien massa,
            convallis a pellentesque nec, egestas non nisi. Mauris blandit aliquet elit,
            eget tincidunt nibh pulvinar a. Nulla porttitor accumsan tincidunt. Nulla quis
            lorem ut libero malesuada feugiat.
          </p>
        </div>

        {/* ===== RIGHT IMAGE ===== */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/chruch-06.jpg"
            alt="Church Architecture"
            width={700}
            height={500}
            className="rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
