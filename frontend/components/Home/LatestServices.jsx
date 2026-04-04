"use client";
import { ArrowRight, Users, BarChart3, Target, RefreshCcw } from "lucide-react";

export default function LatestServices() {
  const services = [
    {
      title: "Strategic Investments",
      desc: "Everyone with high and useful reward for his We offer",
      icon: <BarChart3 className="w-6 h-6 text-black" />,
    },
    {
      title: "Putting Customers First",
      desc: "Everyone with high and useful reward for his We offer",
      icon: <Users className="w-6 h-6 text-black" />,
    },
    {
      title: "Smarter Business Decisions",
      desc: "Everyone with high and useful reward for his We offer",
      icon: <Target className="w-6 h-6 text-black" />,
    },
    {
      title: "Driving Innovation with agile",
      desc: "Everyone with high and useful reward for his We offer",
      icon: <RefreshCcw className="w-6 h-6 text-black" />,
    },
  ];

  return (
    <section className="bg-[#052B2B] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Heading */}
        <p className="text-green-400 font-semibold text-sm flex items-center gap-2 mb-4">
          <span className="text-lg">▸</span> LATEST SERVICES
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-3xl md:text-5xl font-bold leading-snug">
            We provide consulting to <br /> strategic growth.
          </h2>
          <p className="text-gray-300 max-w-lg">
            Finclix is the destination where early adopters and innovation
            enthusiasts discover cutting-edge technology
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 mb-12">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#0B3D3D] rounded-xl p-8 pt-16 text-center relative flex flex-col items-center"
            >
              {/* Floating Icon */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-green-300 to-green-600 rounded-full p-5">
                {service.icon}
              </div>

              <h3 className="font-semibold text-lg mt-4 mb-3">{service.title}</h3>
              <p className="text-sm text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Highlight Box */}
        <div className="bg-gradient-to-r from-green-400 to-green-300 text-black rounded-full py-4 px-6 flex items-center justify-center gap-3 font-medium max-w-3xl mx-auto">
          <span className="bg-black text-green-300 rounded-full p-2">
            <ArrowRight className="w-5 h-5" />
          </span>
          <span>
            We Strive To Lead The Way In The Business{" "}
            <a href="/services" className="underline font-semibold">
              Know All Services
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
