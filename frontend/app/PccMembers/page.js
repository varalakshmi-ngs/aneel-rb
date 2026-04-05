export const dynamic = "force-dynamic";
// import WhatWeDo from "@/components/AboutUs/WhatWeDo";
import PccMembers from "@/components/PccMembers";
import BusinessJourney from "@/components/Home/BusinessJourney";
import ContactSection from "@/components/Home/ContactSection";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import Ourpccmembers from "@/components/Ourpccmembers";
import React from "react";

import { getApiBase } from "@/utils/apiBase";

async function getPccMembers() {
  try {
    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/pcc-members`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch PCC members:", error);
    return [];
  }
}

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

export default async function page() {
  const members = await getPccMembers();
  const homeSections = await getHomeSections();
  const aboutSection = homeSections.find((section) => section.section_key === "aboutus") || {};

  return (
    <div>
      <Ourpccmembers />
      <BusinessJourney aboutSection={aboutSection} />
      {/* directors list */}
      <PccMembers members={members} />
      {/* <WhatWeDo /> */}
      <ContactSection />
    </div>
  );
}
