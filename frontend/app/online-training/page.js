// import FaqSection from "@/components/BusinessConsulting/FaqSection";
import OnlineTrainingCom from "@/components/OnlineTrainingCom";
import CustomHeroSection from "@/utils/CustomHeroSection";
import ServiceHeadSection from "@/utils/SeviceHeadSection";
import React from "react";

export default function page() {
  return (
    <div>
      {/* 🔹 Hero Section */}
      <CustomHeroSection
        backgroundImage="/images/service-2.jpg"
        headingLines={["Online Training"]}
        subHeadingLines={[
          "We provide flexible and interactive online training programs designed to enhance skills, boost career growth, and empower learners worldwide.",
        ]}
      />

      {/* 🔹 Service Head Section */}
      <ServiceHeadSection
        label="Online Training"
        headingLines={["Empowering Learning Through Online Training"]}
        paragraphLines={[
          "Our online training services are tailored to meet the needs of individuals and organizations seeking effective, scalable, and accessible learning solutions.",
          "With expert instructors, real-time sessions, and practical projects, we ensure learners gain the knowledge and confidence required to excel in their careers.",
        ]}
        videoImage="/images/service-details.jpg"
      />

      <OnlineTrainingCom />


      {/* 🔹 FAQ Section */}
      {/* <FaqSection /> */}
    </div>
  );
}
