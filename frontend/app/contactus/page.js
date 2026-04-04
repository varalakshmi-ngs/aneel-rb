import Contact from "@/components/ContactUs/Contact";
import ContactSection from "@/components/Home/ContactSection";
import CustomHeroSection from "@/utils/CustomHeroSection";
import React from "react";

export default function page() {
  return (
    <div>
      <CustomHeroSection
        backgroundImage="/images/contactus.jpg"
        headingLines={["Let’s Stay Connected in God’s Love"]}
        subHeadingLines={[
          "Have a question, need prayer, or want to join our worship family?.",
          "We’re just a message away — ready to listen and support you.",
        ]}
      />

      <Contact />
      <ContactSection />
    </div>
  );
}
