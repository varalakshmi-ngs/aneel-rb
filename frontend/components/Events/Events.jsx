"use client";

import { useState } from "react";

export default function EventsList({ events = [] }) {
  const defaultEvents = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "Nov 3, 2025",
      time: "9:00 AM - 11:00 AM",
      location: "Faithful Church, Hyderabad",
      excerpt:
        "Join us for an uplifting worship service filled with praise, word, and fellowship.",
      image_url: "/images/event-01.avif",
    },
    {
      id: 2,
      title: "Youth Fellowship Night",
      date: "Nov 8, 2025",
      time: "6:00 PM - 8:30 PM",
      location: "Community Hall, Hyderabad",
      excerpt:
        "An evening of music, games, and encouragement for youth to grow in faith together.",
      image:
        "/images/event-02.jpg",
    },
    {
      id: 3,
      title: "Christmas Choir Rehearsal",
      date: "Nov 15, 2025",
      time: "5:00 PM - 7:00 PM",
      location: "Main Sanctuary, Faithful Church",
      excerpt:
        "Calling all singers! Join our Christmas choir practice and be part of our celebration event.",
      image:
        "https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      title: "Bible Study: Book of Acts",
      date: "Nov 20, 2025",
      time: "7:00 PM - 8:30 PM",
      location: "Online (Zoom)",
      excerpt:
        "A deep dive into the Book of Acts — understanding the power of the early church.",
      image:
        "/images/event-04.jpg",
    },
    {
      id: 5,
      title: "Community Outreach Program",
      date: "Nov 25, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Old City, Hyderabad",
      excerpt:
        "Join hands to serve food and share hope with the underprivileged families in our community.",
      image:
        "/images/event-05.webp",
    },
    {
      id: 6,
      title: "Women's Prayer Gathering",
      date: "Dec 2, 2025",
      time: "5:30 PM - 7:00 PM",
      location: "Church Prayer Hall",
      excerpt:
        "An evening of prayer, encouragement, and testimony sharing for women of faith.",
      image:
        "/images/event-06.jpg",
    },
    {
      id: 7,
      title: "Christmas Eve Celebration",
      date: "Dec 24, 2025",
      time: "7:00 PM - 9:30 PM",
      location: "Faithful Church Campus",
      excerpt:
        "Celebrate the birth of Christ with carols, drama, and a powerful Christmas message.",
      image:
        "/images/event-07.jpg",
    },
    {
      id: 8,
      title: "New Year Thanksgiving Service",
      date: "Jan 1, 2026",
      time: "12:00 AM - 1:30 AM",
      location: "Faithful Church Main Hall",
      excerpt:
        "Welcome the new year in prayer and thanksgiving as we commit our plans to the Lord.",
      image:
        "/images/event-08.avif",
    },
    {
      id: 9,
      title: "Sunday School Fun Day",
      date: "Jan 15, 2026",
      time: "10:00 AM - 1:00 PM",
      location: "Church Garden Area",
      excerpt:
        "A day filled with games, songs, and stories designed for kids to learn about Jesus joyfully.",
      image:
        "/images/event-09.avif",
    },
    {
      id: 10,
      title: "Men’s Fellowship Breakfast",
      date: "Jan 25, 2026",
      time: "8:00 AM - 10:00 AM",
      location: "Church Cafeteria",
      excerpt:
        "Gather with other men for breakfast, fellowship, and inspiring testimonies.",
      image:
        "/images/event-10.jpg",
    },
    {
      id: 11,
      title: "Mission Sunday",
      date: "Feb 2, 2026",
      time: "9:00 AM - 12:00 PM",
      location: "Faithful Church, Hyderabad",
      excerpt:
        "Hear from our missionaries and learn how you can support spreading the Gospel worldwide.",
      image:
        "/images/event-11.avif",
    },
    {
      id: 12,
      title: "Couples Retreat 2026",
      date: "Feb 14, 2026",
      time: "9:00 AM - 5:00 PM",
      location: "Resort Retreat Center, Secunderabad",
      excerpt:
        "A full-day retreat for couples to strengthen their bond and faith through guided sessions.",
      image:
        "/images/event-12.jpeg",
    },
    {
      id: 13,
      title: "Healing & Miracle Service",
      date: "Mar 3, 2026",
      time: "6:00 PM - 9:00 PM",
      location: "Faithful Church Auditorium",
      excerpt:
        "A powerful night of worship, healing, and testimonies — come expecting miracles!",
      image:
        "/images/event-13.avif",
    },
    {
      id: 14,
      title: "Easter Sunday Celebration",
      date: "Apr 5, 2026",
      time: "9:00 AM - 11:30 AM",
      location: "Faithful Church Grounds",
      excerpt:
        "Celebrate the resurrection of Jesus Christ with worship, message, and fellowship breakfast.",
      image:
        "/images/event-14.avif",
    },
  ];

  const eventItems = events.length > 0 ? events : defaultEvents;

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const totalPages = Math.ceil(eventItems.length / eventsPerPage);

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = eventItems.slice(indexOfFirst, indexOfLast);

  return (
    <main className="min-h-screen bg-[#ffffff] text-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#022147]">
            Church Events & Gatherings
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Stay updated with all our upcoming worship services, fellowship events, and outreach programs.
          </p>
        </header>

        <section className="flex flex-col gap-8">
          {currentEvents.map((ev) => (
            <article
              key={ev.id}
              onDragStart={(e) => e.preventDefault()}
              className="group flex flex-col md:flex-row bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100"
            >
              <div className="md:w-1/2 h-60">
                <img
                  src={ev.image_url || ev.image || "/images/event-01.avif"}
                  alt={ev.title}
                  draggable={false}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-[#022147] font-medium mb-2">
                    {ev.date || ev.event_date}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-[#F74F22]">
                    {ev.title}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600">
                    {ev.excerpt || ev.description || "Join us for this event and worship together."}
                  </p>
                  <p className="mt-2 text-sm font-medium text-green-600">
                    Tickets: Free
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <div>{ev.time}</div>
                    <div>{ev.location}</div>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F74F22] text-white text-sm font-medium hover:opacity-95"
                    onClick={(e) => e.preventDefault()}
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* pagination */}
        <footer className="mt-10 flex justify-center">
          <nav className="inline-flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-slate-100 shadow-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === idx + 1
                    ? "bg-[#022147] text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </footer>
      </div>
    </main>
  );
}
