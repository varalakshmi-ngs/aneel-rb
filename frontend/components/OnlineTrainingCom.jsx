import ServiceDetails from "@/utils/ServiceDetails";

export default function OnlineTrainingCom() {
  const description = [
    "Our online training programs provide interactive, flexible, and practical learning experiences for individuals and teams looking to upskill in modern technologies.",
    "With expert instructors and hands-on projects, our training ensures learners gain real-world skills that can be immediately applied in professional settings."
  ];

  const processSteps = [
    { num: "01", title: "Needs Assessment", desc: "Identifying skill gaps and training requirements to create a personalized learning plan for participants." },
    { num: "02", title: "Curriculum Design", desc: "Designing structured modules with clear objectives, exercises, and assessments to enhance learning outcomes." },
    { num: "03", title: "Interactive Training Sessions", desc: "Conducting live and on-demand sessions, including hands-on exercises and collaborative projects." },
    { num: "04", title: "Evaluation & Certification", desc: "Assessing participants’ progress, providing feedback, and awarding certificates to validate skills learned." },
  ];

  const outcomes = [
    "Enhanced professional skills and knowledge in key technology areas.",
    "Practical experience through hands-on projects and real-world exercises.",
    "Increased confidence and productivity in the workplace.",
    "Certification that validates new skills and boosts career growth."
  ];

  const images = [
    { src: "/images/service-details.jpg", alt: "Team discussing project" },
    { src: "/images/service-2.jpg", alt: "Business meeting with charts" },
  ];

  const moreServices = [
    { name: "Invest Process" },
    { name: "Business Consulting" },
    { name: "It Services" },
    // { name: "Online Training" },
    { name: "Mobile Solutions" },
    { name: "App Development Services" },
  ];

  const contactInfo = {
    address: "Learning Center, Silicon Valley",
    city: "94016, USA",
    email: "training@fufo.com",
    phone: "+1 415 987 6543",
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
