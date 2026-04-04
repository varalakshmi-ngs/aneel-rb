import ServiceDetails from "@/utils/ServiceDetails";

export default function MobileSolutionsCom() {
  const description = [
    "Our mobile solutions empower businesses to connect with their customers anytime, anywhere. We create innovative mobile applications that enhance user engagement and streamline operations.",
    "From concept to deployment, our team delivers high-performance, secure, and scalable mobile apps tailored to meet business goals and user expectations."
  ];

  const processSteps = [
    { num: "01", title: "Requirement Analysis", desc: "Understanding client needs, business objectives, and user expectations to define the app’s core functionality." },
    { num: "02", title: "Design & Prototyping", desc: "Creating intuitive UI/UX designs and prototypes to ensure a seamless and engaging mobile experience." },
    { num: "03", title: "Development & Testing", desc: "Building robust mobile applications with the latest frameworks, followed by rigorous testing for performance and security." },
    { num: "04", title: "Deployment & Support", desc: "Publishing apps on app stores and providing ongoing maintenance, updates, and technical support." },
  ];

  const outcomes = [
    "High-performance mobile apps that drive customer engagement.",
    "Custom solutions that align with business goals and user needs.",
    "Seamless user experience across multiple platforms and devices.",
    "Scalable and secure apps with ongoing support and updates."
  ];

  const images = [
    { src: "/images/service-details.jpg", alt: "Team discussing project" },
    { src: "/images/service-2.jpg", alt: "Business meeting with charts" },
  ];

  const moreServices = [
    { name: "Invest Process" },
    { name: "Business Consulting" },
    { name: "It Services" },
    { name: "Online Training" },
    // { name: "Mobile Solutions" },
    { name: "App Development Services" },
  ];

  const contactInfo = {
    address: "Tech Hub, San Francisco",
    city: "94105, USA",
    email: "mobile@fufo.com",
    phone: "+1 628 123 4567",
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