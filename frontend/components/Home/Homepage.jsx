"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function SafeImage({ src, fallback, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
      {...props}
    />
  );
}

export default function Homepage({ heroSection = {} }) {
  const safeText = (value, fallback) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return fallback;
  };

  const safeUrl = (value, fallback) => {
    if (typeof value === 'string' && value.trim() !== '') return value;
    return fallback;
  };

  const hero = {
    title: safeText(heroSection.title, "“శాంతిని కలిగించే వారు ధన్యులు.”"),
    subtitle: safeText(heroSection.subtitle, "my community grows in faith through worship, fellowship, and service."),
    description: safeText(heroSection.description, "Join us for weekly programs, events, and ministry opportunities designed to build up every believer."),
    image_url: safeUrl(heroSection.image_url, "/images/chruch-07.jpg"),
  };

  const pastorImages = Array.isArray(heroSection?.pastors) ? heroSection.pastors.map(p => ({
    id: p.id || Math.random(),
    src: safeUrl(p.image_url, "/images/pastor1.webp"),
    name: safeText(p.name, `Pastor ${typeof p.position === 'number' ? p.position + 1 : 1}`),
  })) : [];

  // Fill to 10 pastors if needed
  while (pastorImages.length < 10) {
    pastorImages.push({
      id: Math.random(),
      src: "/images/pastor1.webp",
      name: `Pastor ${pastorImages.length + 1}`
    });
  }

  const heroPastorFromMeta = heroSection.hero_pastor_name && heroSection.hero_pastor_image_url ? {
    src: safeUrl(heroSection.hero_pastor_image_url, null),
    name: safeText(heroSection.hero_pastor_name, null),
  } : null;

  const heroPastor = {
    src: safeUrl(heroPastorFromMeta?.src, safeUrl(pastorImages[0]?.src, "/images/pastor1.webp")),
    name: safeText(heroPastorFromMeta?.name, safeText(pastorImages[0]?.name, "Salman Raju Kondamudi")),
  };

  return (
    <section className="relative w-full min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* === LEFT SIDE === */}
      <div className="relative flex items-center justify-center text-white overflow-hidden min-h-[85vh] md:min-h-[90vh]">
        <SafeImage
          src={hero.image_url}
          fallback="/images/chruch-07.jpg"
          alt="Church Background"
          fill
          className="object-cover brightness-90"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative flex flex-col items-center justify-start bg-white text-center py-16 md:py-20 px-4 sm:px-6 md:px-10 mt-10 md:mt-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          {/* Verse */}
          <div className="text-[#F74F22] text-center lg:text-left max-w-md">
            <p className="text-2xl sm:text-3xl md:text-5xl italic font-semibold leading-snug drop-shadow-sm">
             “ {hero.title} ”
            </p>
            <p className="mt-6 text-base sm:text-lg text-[#022147] leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          {/* Pastor */}
          <div className="flex flex-col items-center justify-center mt-6 lg:mt-0">
            <div className="relative w-38 h-38 sm:w-36 sm:h-36 md:w-44 md:h-44 hover:scale-105 transition-transform duration-500">
              <SafeImage
                src={heroPastor.src}
                fallback="/images/pastor1.webp"
                alt={heroPastor.name}
                fill
                className="object-contain rounded-lg shadow-md"
                sizes="(max-width: 768px) 40vw, 200px"
              />
            </div>
            <h3 className="bg-[#022147] text-white px-5 py-2 rounded-md font-semibold text-base sm:text-lg md:text-xl shadow-md mt-2">
              {heroPastor.name}
            </h3>

            {/* Cross Icon */}
            <div className="mt-4 flex items-center justify-center">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-[0_0_25px_rgba(247,79,34,0.8)] flex items-center justify-center">
                <Image
                  src="/images/cross.png"
                  alt="Cross Icon"
                  fill
                // className="object-contain animate-pulse"
                  sizes="80px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === PASTORS TITLE === */}
        <h2 className="text-[#022147] font-bold text-xl sm:text-2xl md:text-3xl mt-10 mb-4 text-center">
          Our Pastors
        </h2>

        {/* === Pastors grid === */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">

            {pastorImages.map((member) => (
              <div key={member.id} className="flex flex-col items-center">

                <div
                  className="relative w-28 h-32 sm:w-32 sm:h-36 md:w-30 md:h-40
                              rounded-xl border-4 border-[#F74F22] overflow-hidden shadow-md
                              hover:scale-102 transition-transform duration-300"
                >
                  <SafeImage
                    src={member.src}
                    fallback="/images/pastor1.webp"
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                  />
                </div>

                <p className="mt-2 text-[#022147] font-semibold text-sm md:text-base text-center">
                  {member.name}
                </p>

              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
