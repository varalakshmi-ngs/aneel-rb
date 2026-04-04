// import FaqSection from "@/components/BusinessConsulting/FaqSection";
import MobileSolutionsCom from "@/components/MobileSolutionsCom";
import CustomHeroSection from "@/utils/CustomHeroSection";
import ServiceHeadSection from "@/utils/SeviceHeadSection";
import React from "react";

export default function page() {
  return (
    <div>
      {/* 🔹 Hero Section */}
      <CustomHeroSection
        backgroundImage="/images/service-2.jpg"
        headingLines={["Mobile Solutions"]}
        subHeadingLines={[
          "We build innovative mobile solutions to help businesses connect with customers, improve efficiency, and create seamless digital experiences on the go.",
        ]}
      />

      {/* 🔹 Service Head Section */}
      <ServiceHeadSection
        label="Mobile Solutions"
        headingLines={["Transforming Ideas into Mobile Experiences"]}
        paragraphLines={[
          "Our mobile solutions empower businesses to stay connected with customers anytime, anywhere. We design apps that are intuitive, fast, and highly engaging.",
          "From custom mobile app development to cross-platform solutions, we ensure scalability, security, and performance to meet your evolving business needs.",
        ]}
        videoImage="/images/service-details.jpg"
      />
      <MobileSolutionsCom />

      {/* 🔹 FAQ Section */}
      {/* <FaqSection /> */}
    </div>
  );
}
