export const dynamic = "force-dynamic";
// import Testimonials from "@/components/AboutUs/Testimonials";
// import WhatWeDo from "@/components/AboutUs/WhatWeDo";
// import BusinessJourney from "@/components/Home/BusinessJourney";
// import ContactSection from "@/components/Home/ContactSection";
// import TeamSection from "@/components/Home/TeamSection";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import AboutPage from "@/components/AboutUs/AboutUs";
import ApproachSection from "@/components/AboutUs/ApproachSection";
// import TimelineSection from "@/components/AboutUs/TimelineSection";
import OurVision from "@/components/AboutUs/OurVision";
// import Aboutcard from "@/components/AboutUs/Aboutcard";
import Pastorinfo from "@/components/AboutUs/Pastorinfo";
import History from "@/components/AboutUs/History";

import React from "react";
import { getApiBase } from "@/utils/apiBase";

async function getHomeSections() {
  try {
    const API_BASE = getApiBase();
    // Cache "no-store" to ensure we get the latest
    const res = await fetch(`${API_BASE}/home`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch home sections:", error);
    return [];
  }
}

export default async function page() {
  const homeSections = await getHomeSections();
  const aboutSection = homeSections.find((section) => section.section_key === "aboutus") || {};

  return (
    <div>
      {/* <CustomHeroSection
        backgroundImage="/images/office-team.jpg"
        headingLines={[
          "Empowering Businesses Globally",
        ]}
        subHeadingLines={[
          "RoboOnline delivers cutting-edge software, AI, and IT services that drive growth.",
        ]}
      /> */}
      {/* <BusinessJourney /> */}
      {/* what wwe do */}
      {/* <WhatWeDo />
      <TeamSection />
      <Testimonials />
      <ContactSection /> */}
      <AboutPage/>
      <Pastorinfo/>
      <History/>
      {/* <BusinessJourney aboutSection={aboutSection} /> */}
      {/* <Aboutcard/> */}
      {/* <TimelineSection/> */}
      <OurVision/>
      <ApproachSection/>
    </div>
  );
}
