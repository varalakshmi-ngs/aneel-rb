"use client";

import Link from "next/link";

export default function HomepageEvent() {
    const event = {
        id: 1,
        title: "Sunday Worship Service",
        date: "Nov 3, 2025",
        time: "9:00 AM - 11:00 AM",
        location: "Faithful Church, Hyderabad",
        excerpt:
            "Join us for an uplifting worship service filled with praise, word, and fellowship.",
        image: "/images/event-01.avif",
    };

    return (
        <section className="w-full bg-[#FFFFFF] py-16 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 text-center">
                {/* ===== Header ===== */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#022147] mb-6">
                    Upcoming Church Event
                </h2>
                <p className="text-slate-600 mb-10">
                    Stay connected and participate in our upcoming worship and fellowship gatherings.
                </p>

                {/* ===== Event Box (Single Event) ===== */}
                <div
                    className="
                    relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden 
                    border border-[#F74F22]/30 bg-white flex flex-col md:flex-row 
                    shadow-lg transition-all duration-500 
                    hover:-translate-y-2 hover:shadow-xl
                            "
                >

                    {/* === Event Image === */}
                    <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* === Event Content === */}
                    <div className="md:w-1/2 p-6 text-left flex flex-col justify-between relative">
                        {/* === Button on Top Right === */}
                        <div className="absolute top-6 right-6">
                            <Link
                                href="/Events"
                                className="
                  inline-block
                  border-2 border-[#F74F22]
                  bg-[#F74F22]
                  text-white
                  font-semibold
                  px-6 py-2
                  rounded-lg
                  shadow-md
                  transition-all duration-300
                  hover:bg-[#022147]
                  hover:border-[#022147]
                  hover:shadow-[0_0_20px_rgba(247,79,34,0.5)]
                  hover:scale-105
                "
                            >
                                View All Events
                            </Link>
                        </div>

                        {/* === Text Content (Comes Below Button) === */}
                        <div className="mt-16">
                            <div className="text-sm font-medium text-[#022147] mb-1">
                                {event.date} • {event.time}
                            </div>
                            <h3 className="text-2xl font-semibold text-[#022147] mb-3">
                                {event.title}
                            </h3>
                            <p className="text-slate-700 text-sm mb-3">{event.excerpt}</p>
                            <p className="text-xs text-slate-500">{event.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
