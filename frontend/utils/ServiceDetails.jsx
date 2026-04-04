"use client";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

export default function ServiceDetails({
  description = [],
  processSteps = [],
  outcomes = [],
  images = [],
  moreServices = [],
  contactInfo = {},
}) {
  return (
    <section className="bg-[#062522] py-12 px-4 sm:px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        {/* ✅ Left Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Description</h2>
            {description.map((para, i) => (
              <p key={i} className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                {para}
              </p>
            ))}
          </div>

          {/* Service Process */}
          {processSteps.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Service Process</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {processSteps.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-green-300 text-xl sm:text-2xl font-bold">{item.num}</h3>
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Outcome */}
          {outcomes.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Service Outcome</h2>
              <ul className="space-y-4 text-sm sm:text-base">
                {outcomes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <FaCheck className="text-green-300 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {images.map((img, i) => (
                <Image
                  key={i}
                  src={img.src}
                  alt={img.alt || "Service Image"}
                  width={img.width || 600}
                  height={img.height || 400}
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* ✅ Right Sidebar */}
        <aside className="space-y-8">
          {/* More Services */}
          {moreServices.length > 0 && (
            <div className="bg-[#0a2e2b] p-5 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-6 relative pb-2 border-b border-gray-700">
                More Services
                <span className="absolute left-0 bottom-0 w-12 h-[2px] bg-green-300"></span>
              </h3>
              <ul className="space-y-4 mb-6 text-sm sm:text-base">
                {moreServices.map((item, i) => (
                  <li
                    key={i}
                    className={`flex justify-between items-center cursor-pointer transition ${
                      item.active ? "text-white font-medium" : "text-gray-300 hover:text-green-300"
                    }`}
                  >
                    <span>{item.name}</span>
                    <IoIosArrowForward />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Box */}
          {contactInfo && Object.keys(contactInfo).length > 0 && (
            <div className="bg-[#0a2e2b] p-5 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-6 relative pb-2 border-b border-gray-700">
                Contact With Us
                <span className="absolute left-0 bottom-0 w-12 h-[2px] bg-green-300"></span>
              </h3>
              <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                {contactInfo.address && <p>{contactInfo.address}</p>}
                {contactInfo.city && <p>{contactInfo.city}</p>}
                {contactInfo.email && <p className="text-green-300">{contactInfo.email}</p>}
                {contactInfo.phone && <p className="font-semibold">{contactInfo.phone}</p>}
              </div>
            </div>
          )}

          {/* Send Message Form */}
          <div className="bg-[#0a2e2b] p-5 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 relative pb-2 border-b border-gray-700">
              Send Message
              <span className="absolute left-0 bottom-0 w-12 h-[2px] bg-green-300"></span>
            </h3>
            <form className="space-y-4 text-sm sm:text-base">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              />
              <textarea
                placeholder="Write a Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-green-300 text-[#062522] font-semibold hover:bg-green-400 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
