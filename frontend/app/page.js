import Testimonials from "@/components/AboutUs/Testimonials";
export const dynamic = "force-dynamic";
// import WhatWeDo from "@/components/AboutUs/WhatWeDo";
import BusinessJourney from "@/components/Home/BusinessJourney";
// import ContactSection from "@/components/Home/ContactSection";
// import TeamSection from "@/components/Home/TeamSection";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import Homepage from "@/components/Home/Homepage";
import Homepage2 from "@/components/Home/Homepage2";
import ChurchTimings from "@/components/ChurchTimings";
// import HomepageEvent from "@/components/HomepageEvent";
import EventsList from "@/components/Events/Events";
// import Ourevents from "@/components/Events/Ourevents";

import React from "react";

import { getApiBase } from "@/utils/apiBase";

async function getHomeSections() {
  try {
    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/home`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch home sections:", error);
    return [];
  }
}

async function getEvents() {
  try {
    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/events`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch events:", error);
    return [];
  }
}

export default async function page() {
  const homeSections = await getHomeSections();
  const events = await getEvents();
  const heroSection = homeSections.find((section) => section.section_key === "hero") || {};
  const timetableSection = homeSections.find((section) => section.section_key === "weekly_timetable") || {};
  const aboutSection = homeSections.find((section) => section.section_key === "aboutus") || {};

  return (
    <div>
      
      <Homepage heroSection={heroSection} />
      <BusinessJourney aboutSection={aboutSection} />
      <Homepage2 />
      <ChurchTimings schedule={(timetableSection.meta && typeof timetableSection.meta === "string"
        ? (() => { try { return JSON.parse(timetableSection.meta); } catch { return {}; } })()
        : (timetableSection.meta || {})
      ).schedule} />
      {/* <Ourevents /> */}
      <EventsList events={events} />
      {/* what wwe do */}
      {/* <WhatWeDo /> */}
      {/* <TeamSection /> */}
      <Testimonials />
      {/* <ContactSection /> */}
    </div>
  );
}