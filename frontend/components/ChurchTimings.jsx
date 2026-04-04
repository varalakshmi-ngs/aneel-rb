"use client";
import React from "react";

export default function ChurchTimings({ schedule: scheduleOverride }) {
  const schedule = Array.isArray(scheduleOverride) && scheduleOverride.length
    ? scheduleOverride
    : [
      { title: "Morning Service", detail: "Regular Service 10:30 AM" },
      { title: "Evening Service", detail: "7:00 PM to 9:00 PM", note: "Wed (Senior Citizen)" },
      { title: "Sunday Regular", detail: "10:30 AM to 1:00 PM" },
      { title: "Sunday Evening", detail: "6:30 PM to 9:00 PM" },
      { title: "Saturday Evening", detail: "Women Fasting Prayer 7:00 PM to 9:00 PM" },
      { title: "Friday Evening", detail: "Fasting Prayer 7:00 PM to 9:00 PM" },
    ];

  return (
    <section className="w-3/5 bg-[#eaf4ff] p-8 lg:px-12 rounded-lg mx-auto mt-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[#1565c0] text-center">Weekly Timetable</p>
          <h2 className="mt-3 text-4xl font-semibold text-[#0f172a] text-center">Church Weekly Timings</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569] text-center">
            Here is the weekly schedule for regular worship services, evening prayer, and the special fellowship meetings.
          </p>
          <div className="mt-8 text-sm text-[#475569] border border-[#cbd5e1] rounded-lg inline-block px-4 py-2">
            <p className="font-semibold text-2xl text-[#0f172a]">Active Days</p>
            <p className="text-xl">Wed, Fri, Sat, Sun</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Weekly Timings</h3>
            <ul className="space-y-4 text-[#1e3a8a]">
              {schedule.slice(0, 4).map((item, index) => (
                <li key={index} className="border-b border-slate-300 pb-3">
                  <p className="font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#475569]">{item.detail}</p>
                  {item.note ? <p className="mt-1 text-xs text-[#64748b]">{item.note}</p> : null}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Ministerial Fellowships</h3>
            <ul className="space-y-4 text-[#1e3a8a]">
              {schedule.slice(4).map((item, index) => (
                <li key={index} className="border-b border-slate-300 pb-3 w-[345px]">
                  <p className="font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#475569]">{item.detail}</p>
                </li>
              ))}
            </ul>


          </div>
        </div>
      </div>
    </section>
  );
}
