import ServiceDetails from "@/utils/ServiceDetails";

export default function ItServiceCom() {
  const description = [
    "IT services encompass a wide range of technology solutions that help businesses streamline operations, enhance productivity, and achieve digital transformation.",
    "From infrastructure management to cloud computing and cybersecurity, IT services ensure that organizations stay agile, secure, and scalable in today’s digital economy."
  ];

  const processSteps = [
    { num: "01", title: "Requirement Analysis", desc: "Understanding client needs and identifying the best technology solutions to align with business goals." },
    { num: "02", title: "System Design & Planning", desc: "Creating a blueprint for software, infrastructure, or network solutions to ensure efficiency and scalability." },
    { num: "03", title: "Implementation & Integration", desc: "Deploying IT solutions, integrating with existing systems, and ensuring smooth functionality." },
    { num: "04", title: "Support & Maintenance", desc: "Providing ongoing technical support, monitoring systems, and performing upgrades for optimal performance." },
  ];

  const outcomes = [
    "Enhanced operational efficiency through automation and optimized workflows.",
    "Improved data security and compliance with industry standards.",
    "Scalable solutions that grow with business demands.",
    "Reduced downtime and better user experience with reliable IT support.",
  ];

  const images = [
    { src: "/images/service-details.jpg", alt: "Team discussing project" },
    { src: "/images/service-2.jpg", alt: "Business meeting with charts" },
  ];

  const moreServices = [
    { name: "Invest Process" },
    { name: "Business Consulting" },
    // { name: "It Services" },
    { name: "Online Training" },
    { name: "Mobile Solutions" },
    { name: "App Development Services" },
  ];

  const contactInfo = {
    address: "Silicon Valley, California",
    city: "94016, USA",
    email: "itservices@fufo.com",
    phone: "+1 415 123 4567",
  };

  return (
    <ServiceDetails
      description={description}
      processSteps={processSteps}
      outcomes={outcomes}
      images={images}
      moreServices={moreServices}
      contactInfo={contactInfo}
    />
  );
}
