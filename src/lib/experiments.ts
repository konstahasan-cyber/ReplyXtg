import "server-only";
import { cookies } from "next/headers";
import { controlVariants, experiments, experimentsEnabled, type ExperimentKey, type Variant, type VariantMap } from "@/config/experiments";

/**
 * Reads the visitor's sticky variants (assigned in `src/proxy.ts`).
 * When experiments are disabled this never touches cookies, so pages stay static.
 */
export async function getVariants(): Promise<VariantMap> {
  if (!experimentsEnabled) return controlVariants;
  const jar = await cookies();
  const out = { ...controlVariants };
  for (const key of Object.keys(experiments) as ExperimentKey[]) {
    const v = jar.get(experiments[key].cookie)?.value;
    if (v === "A" || v === "B") out[key] = v as Variant;
  }
  return out;
}
