"use client";

import TopBar from "@/components/TopBar";

export default function AdminTopBarGate() {
  // Always render the top bar, including admin pages.
  return <TopBar />;
}

