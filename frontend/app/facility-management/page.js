import AppDevelopmentCom from "@/components/AppDevelopmentCom";
// import FaqSection from "@/components/BusinessConsulting/FaqSection";
import CustomHeroSection from "@/utils/CustomHeroSection";
import ServiceHeadSection from "@/utils/SeviceHeadSection";
import React from "react";

export default function page() {
  return (
    <div>
      {/* 🔹 Hero Section */}
      <CustomHeroSection
        backgroundImage="/images/service-2.jpg"
        headingLines={["App Development"]}
        subHeadingLines={[
          "We provide end-to-end app development services to create powerful, scalable, and user-friendly applications tailored to your business needs.",
        ]}
      />

      {/* 🔹 Service Head Section */}
      <ServiceHeadSection
        label="App Development"
        headingLines={["Building Innovative Applications"]}
        paragraphLines={[
          "Our app development services cover everything from planning, design, and development to deployment and maintenance. We build apps that deliver seamless user experiences across devices.",
          "Whether it’s a native, hybrid, or cross-platform application, our solutions are designed to be secure, scalable, and performance-driven, helping your business stay ahead in the digital age.",
        ]}
        videoImage="/images/service-details.jpg"
      />
      <AppDevelopmentCom />
      {/* 🔹 FAQ Section */}
      {/* <FaqSection /> */}
    </div>
  );
}
