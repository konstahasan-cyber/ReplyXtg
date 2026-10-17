import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePlanner } from "@/components/planner/HomePlanner";

export const metadata: Metadata = {
  title: "Custom Home Planner — Start Planning Your Home",
  description:
    "Answer seven quick questions about land, size, style, budget range and timing to receive a personalized custom home project summary with suggested next steps.",
  alternates: { canonical: "/planner" },
};

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-[80svh] bg-ivory" />}>
      <HomePlanner />
    </Suspense>
  );
}
