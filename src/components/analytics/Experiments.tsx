"use client";

import { createContext, useContext, useEffect } from "react";
import { ctaCopy, experimentsEnabled, type VariantMap } from "@/config/experiments";
import { track } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/Button";

const ExperimentContext = createContext<VariantMap>({ cta: "A", hero: "A" });

export function ExperimentProvider({ variants, children }: { variants: VariantMap; children: React.ReactNode }) {
  useEffect(() => {
    if (!experimentsEnabled) return;
    try {
      if (sessionStorage.getItem("ag_exp_exposed")) return;
      sessionStorage.setItem("ag_exp_exposed", "1");
    } catch {
      /* ignore */
    }
    track("experiment_exposure", { exp_cta: variants.cta, exp_hero: variants.hero });
  }, [variants]);
  return <ExperimentContext.Provider value={variants}>{children}</ExperimentContext.Provider>;
}

export const useVariants = () => useContext(ExperimentContext);

/** The site-wide primary CTA. Its label/destination is the subject of the CTA experiment. */
export function PrimaryCta({
  location,
  variant = "primary",
  className,
  arrow,
}: {
  location: string;
  variant?: Parameters<typeof ButtonLink>[0]["variant"];
  className?: string;
  arrow?: boolean;
}) {
  const { cta } = useVariants();
  const copy = ctaCopy[cta];
  return (
    <ButtonLink
      href={copy.href}
      variant={variant}
      className={className}
      arrow={arrow}
      onClick={() => track("primary_cta_click", { location, label: copy.label, exp_cta: cta })}
    >
      {copy.label}
    </ButtonLink>
  );
}
