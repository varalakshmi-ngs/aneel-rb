"use client";

export default function TimelineSection() {
  const timeline = [
    {
      year: "1990",
      title: "Foundation of Our Church",
      description:
        "Our journey began with a small group of believers gathering in prayer and devotion.",
    },
    {
      year: "2005",
      title: "Community Expansion",
      description:
        "We opened new ministries, outreach programs, and expanded our worship family.",
    },
    {
      year: "2015",
      title: "Youth and Mission Work",
      description:
        "Our youth group and missionary outreach strengthened our ties with the community.",
    },
    {
      year: "2022",
      title: "Digital Faith Programs",
      description:
        "We introduced online services and global outreach programs to connect hearts everywhere.",
    },
  ];

  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* ✅ Adjusted: vertical line starts lower (mt-10 = pushes down a bit) */}
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[95%] w-[4px] bg-[#F74F22] hidden md:block" />

        <h2 className="text-center text-4xl font-extrabold text-[#022147] mb-16">
          Our Journey Through Time
        </h2>

        <div className="flex flex-col space-y-16 relative">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <div
                className={`relative md:w-1/2 ${
                  index % 2 === 0
                    ? "md:pr-20 text-right"
                    : "md:pl-20 text-left"
                }`}
              >
                {/* ✅ Adjusted: dot position slightly inward (closer to line) */}
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
                    index % 2 === 0 ? "right-[-10px]" : "left-[-10px]"
                  } w-5 h-5 bg-[#F74F22] rounded-full border-4 border-white shadow-md`}
                />

                {/* Dot (mobile) */}
                <div className="md:hidden flex justify-center mb-4">
                  <div className="w-5 h-5 bg-[#F74F22] rounded-full border-4 border-white shadow-md" />
                </div>

                <h3 className="text-xl font-bold text-[#022147] mb-2">
                  {item.year} — {item.title}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto md:mx-0">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
