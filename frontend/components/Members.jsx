"use client";

import { useMemo, useState } from "react";

export default function MembersPage({ members = [] }) {
  const fallbackMembers = useMemo(() => {
    const names = [
      "John", "Mary", "David", "Grace", "Paul", "Peter", "Susan", "James", "Emily", "Michael",
      "Sarah", "Daniel", "Rachel", "Andrew", "Sophia", "Mark", "Emma", "Joseph", "Olivia", "Samuel",
      "Hannah", "Joshua", "Lily", "Benjamin", "Ava", "Ethan", "Mia", "Jacob", "Ella", "Lucas",
      "Chloe", "Matthew", "Isabella", "Noah", "Amelia", "Nathan", "Charlotte", "Elijah", "Abigail",
      "Caleb", "Grace", "Logan", "Sophie", "Henry", "Victoria", "Leo", "Scarlett", "Owen", "Layla",
      "Isaac", "Zoe", "Eli", "Aria", "Adam", "Nora", "Jack", "Lillian", "Ryan", "Harper",
      "Evan", "Ellie", "Jonathan", "Bella", "Aaron", "Madison", "Charles", "Avery", "Mason", "Evelyn",
      "Liam", "Luna", "Gabriel", "Riley", "Oliver", "Leah", "Jayden", "Hazel", "Carter", "Penelope",
      "Wyatt", "Camila", "Hunter", "Stella", "Dylan", "Violet", "Isaiah", "Aurora", "Luke", "Paisley",
      "Anthony", "Hannah", "Jason", "Savannah", "Alexander", "Addison", "Thomas", "Skylar", "Sebastian", "Nova",
      "Christian", "Lucy", "Dominic", "Aubrey", "Austin", "Elena", "Brandon", "Anna", "Adrian", "Sadie",
      "Jordan", "Eva", "Tyler", "Clara", "Nathaniel", "Alice", "Cole", "Ruby", "Blake", "Willow",
      "Eric", "Naomi", "Xavier", "Lydia", "Justin", "Caroline", "Levi", "Peyton", "Gavin", "Eleanor",
      "Connor", "Hailey", "Julian", "Samantha", "Cameron", "Aaliyah", "Zachary", "Maya", "Ian", "Kennedy",
      "Miles", "Genesis", "Elias", "Faith", "Vincent", "Alexis", "Asher", "Neha", "Nikhil", "Arjun",
      "Priya", "Ananya", "Aarav", "Riya", "Krishna", "Diya", "Ishaan", "Meera", "Rohan", "Sneha",
      "Aditya", "Kavya", "Sai", "Anjali", "Manish", "Pooja", "Raj", "Divya", "Vikram", "Neel",
      "Kiran", "Isha", "Tarun", "Preeti", "Aravind", "Swathi", "Naveen", "Lakshmi", "Akash", "Rachana",
      "Tejas", "Bhavya", "Vikas", "Keerthi", "Harsha", "Chaitra", "Rohit", "Varsha", "Santosh", "Sindhu",
      "Karthik", "Deepa", "Venu", "Mounika", "Suraj", "Aarthi", "Rajesh", "Tulasi", "Mahesh", "Lohita",
    ];
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: shuffled[i % shuffled.length],
      role: `Ward ${(i % 7) + 1}`,
      bio: "Member of the congregation with a passion for service and fellowship.",
    }));
  }, []);

  const displayedMembers = members.length > 0 ? members : fallbackMembers;
  const roles = useMemo(() => {
    const roleSet = new Set(["All"]);
    displayedMembers.forEach((member) => {
      roleSet.add(member.role || "Unassigned");
    });
    return Array.from(roleSet);
  }, [displayedMembers]);

  const [selectedRole, setSelectedRole] = useState("All");

  const filteredMembers = selectedRole === "All"
    ? displayedMembers
    : displayedMembers.filter((member) => (member.role || "Unassigned") === selectedRole);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#f9f9f9] flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#022147] mb-8 text-center tracking-wide">
        Members
      </h1>

      <div className="w-full max-w-5xl mb-6">
        <label className="text-sm font-medium text-[#022147]">
          Filter by role:
          <select
            className="ml-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#022147] focus:outline-none focus:ring-2 focus:ring-[#F74F22]"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative overflow-x-auto w-full max-w-5xl rounded-2xl shadow-[0_0_30px_rgba(2,33,71,0.1)] bg-white border border-gray-200 transition-all duration-300 hover:shadow-[0_0_50px_rgba(2,33,71,0.2)] hover:scale-[1.01]">
        <table className="w-full text-center border-collapse overflow-hidden rounded-lg">
          <thead className="bg-[#022147] text-white text-sm md:text-base uppercase tracking-wide">
            <tr>
              <th className="border border-gray-300 px-4 py-4 w-[80px]">S.No</th>
              <th className="border border-gray-300 px-4 py-4">Name</th>
              <th className="border border-gray-300 px-4 py-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <tr
                  key={member.id ?? index}
                  className="group border-b border-gray-200 transition-all duration-300 hover:bg-[#F74F22]/10 hover:scale-[1.01] hover:shadow-[0_5px_20px_rgba(247,79,34,0.3)] hover:backdrop-blur-sm"
                >
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#022147] transition-all duration-300 group-hover:text-[#F74F22]">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-[#022147] transition-all duration-300 group-hover:text-[#F74F22]">
                    {member.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-[#022147] transition-all duration-300 group-hover:text-[#F74F22]">
                    {member.role || "Unassigned"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-gray-500 italic text-lg border border-gray-300">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
