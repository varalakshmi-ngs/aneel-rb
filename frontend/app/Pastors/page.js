import ContactSection from "@/components/Home/ContactSection";
// import FaqSection from "@/components/Home/FaqSection";
import Pastors  from "@/components/Pastors";
// import CustomHeroSection from "@/utils/CustomHeroSection";
import Ourpastors from "@/components/Ourpastors";
import React from "react";

export default function page() {
  return (
    <div>
      {/* <CustomHeroSection
        backgroundImage="/images/office-team.jpg"
        headingLines={["Meet Our Valued Share Holders"]}
        subHeadingLines={[
          "Our trusted investors drive innovation and support our mission towards global growth.",
        ]}
      /> */}

      {/* shareholder list */}
      <Ourpastors/>
      <Pastors/>
      <ContactSection />
      {/* <FaqSection /> */}
    </div>
  );
}
