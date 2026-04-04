"use client";
import Image from "next/image";

export default function ServiceHeadSection({
  label = "Service Details",
  heading = "",
  paragraph = "",
  videoImage = "",
  showPlayButton = true,
  headingLines = [],
  paragraphLines = [],
}) {
  return (
    <>
      {/* 🔹 Service Headline Section */}
      <section className="bg-[#062522] py-12 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <p className="uppercase tracking-wide text-gray-400 font-medium flex items-center gap-2 mb-4 text-sm sm:text-base">
            <span className="inline-block w-3 h-3 bg-[#a7ff83] rounded-full"></span>
            {label}
          </p>

          {/* Heading + Paragraph */}
          <div className="flex flex-col md:flex-row md:items-start md:gap-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug md:w-1/2">
              {headingLines.length
                ? headingLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))
                : heading}
            </h1>

            <p className="text-gray-300 md:w-1/2 mt-4 sm:mt-6 md:mt-0 text-sm sm:text-base">
              {paragraphLines.length
                ? paragraphLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))
                : paragraph}
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Video/Image Section */}
      {videoImage && (
        <section className="relative bg-[#062522] py-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg">
              {/* Video Preview Image */}
              <Image
                src={videoImage}
                alt="Video Preview"
                fill
                className="object-cover"
                priority
              />

              {/* Play Button Overlay */}
              {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    aria-label="Play Video"
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                               bg-white/90 rounded-full flex items-center justify-center 
                               shadow-xl hover:scale-105 transition"
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#062522]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 4l10 6-10 6V4z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
