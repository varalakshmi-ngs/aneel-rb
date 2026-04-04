import ServiceDetails from "@/utils/ServiceDetails";

export default function AppDevelopmentCom() {
  const description = [
    "Our App Development Services help businesses build powerful, scalable, and user-friendly applications that enhance customer engagement and drive growth.",
    "We specialize in designing and developing custom apps tailored to specific business requirements, ensuring seamless performance across multiple platforms."
  ];

  const processSteps = [
    { num: "01", title: "Planning & Requirement Gathering", desc: "Collaborating with clients to define objectives, features, and technology stack for the application." },
    { num: "02", title: "UI/UX Design", desc: "Creating visually appealing and user-centric designs to deliver intuitive and engaging experiences." },
    { num: "03", title: "App Development", desc: "Building secure, scalable, and high-performing applications using the latest frameworks and technologies." },
    { num: "04", title: "Testing & Deployment", desc: "Conducting comprehensive testing for quality assurance and deploying the app to app stores or enterprise systems." },
  ];

  const outcomes = [
    "Custom applications that align with business goals and customer needs.",
    "Cross-platform compatibility for iOS, Android, and web applications.",
    "Secure, scalable, and high-performing applications.",
    "Ongoing support, updates, and maintenance for long-term success."
  ];

  const images = [
    { src: "/images/service-details.jpg", alt: "Team discussing project" },
    { src: "/images/service-2.jpg", alt: "Business meeting with charts" },
  ];

  const moreServices = [
    { name: "Invest Process" },
    {name:"Business Consulting"},
    { name: "It Services" },
    { name: "Online Training" },
    { name: "Mobile Solutions" },
    // { name: "App Development Services" },
  ];

  const contactInfo = {
    address: "Innovation Park, Silicon Valley",
    city: "94043, USA",
    email: "apps@fufo.com",
    phone: "+1 650 987 6543",
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
