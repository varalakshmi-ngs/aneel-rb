import MembersPage from "@/components/Members";
import OurMembers  from "@/components/OurMembers";

import { getApiBase } from "@/utils/apiBase";

async function getMembers() {
  try {
    const API_BASE = getApiBase();
    const res = await fetch(`${API_BASE}/members`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Unable to fetch members:", error);
    return [];
  }
}

export default async function page() {
  const members = await getMembers();

  return (
    <div>
      <OurMembers />
      <MembersPage members={members} />
    </div>
  );
}