// import FaqSection from "@/components/BusinessConsulting/FaqSection";
import ItServiceCom from "@/components/ItServices/ItServiceCom";
import CustomHeroSection from "@/utils/CustomHeroSection";
import ServiceHeadSection from "@/utils/SeviceHeadSection";
import React from "react";

export default function page() {
  return (
    <div>
      {/* 🔹 Hero Section */}
      <CustomHeroSection
        backgroundImage="/images/service-2.jpg"
        headingLines={["IT Services"]}
        subHeadingLines={[
          "We deliver end-to-end IT services, including software development, cloud solutions, and IT consulting to drive digital transformation and business efficiency.",
        ]}
      />

      {/* 🔹 Service Head Section */}
      <ServiceHeadSection
        label="IT Services"
        headingLines={["Comprehensive IT Solutions"]}
        paragraphLines={[
          "Our IT services are designed to help businesses stay ahead in the digital era with reliable and scalable technology solutions.",
          "From enterprise software development to cloud infrastructure and IT consulting, we ensure seamless integration and sustainable growth for your business.",
        ]}
        videoImage="/images/service-details.jpg"
      />

<ItServiceCom/>
      {/* 🔹 FAQ Section */}
      {/* <FaqSection /> */}
    </div>
  );
}
