import GalleryList from "@/components/GalleryList";
import ContactSection from "@/components/Home/ContactSection";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import VisitUsSection from "@/components/VisitUsSection";
import Ourgallery from "@/components/Ourgallery";
import React from "react";

import { getApiBase } from "@/utils/apiBase";

async function getGalleryItems() {
  try {
    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/gallery`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch gallery items:", error);
    return [];
  }
}

export default async function page() {
  const items = await getGalleryItems();

  return (
    <div>
      <Ourgallery />
      <GalleryList galleryItems={items} />
      <TestimonialsSection />
      <VisitUsSection />
      <ContactSection />
    </div>
  );
}
