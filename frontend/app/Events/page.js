// import ContactSection from "@/components/Home/ContactSection";
// import FaqSection from "@/components/Home/FaqSection";
// import ServicesFinal from "@/components/Events/ServicesFinal";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import EventsList from "@/components/Events/Events";
import Ourevents from "@/components/Events/Ourevents";
import React from "react";

import { getApiBase } from "@/utils/apiBase";

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
  const events = await getEvents();

  return (
    <div>
      <Ourevents />
      <EventsList events={events} />
    </div>
  );
}
