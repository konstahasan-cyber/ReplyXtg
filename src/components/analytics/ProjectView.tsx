"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ProjectView({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    track("project_view", { project: slug, project_name: name });
  }, [slug, name]);
  return null;
}
