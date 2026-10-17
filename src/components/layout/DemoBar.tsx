import Link from "next/link";
import { company } from "@/config/site";

/** Small, honest marker that this is a concept site for a fictional company. */
export function DemoBar() {
  return (
    <div className="relative z-50 bg-forest-deep text-ivory/80">
      <p className="container-x flex h-8 items-center justify-center gap-2 text-[0.68rem] font-medium tracking-[0.16em] uppercase">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-terracotta" />
        {company.demoNotice}
        <Link href="/terms#demo" className="ml-1 hidden underline decoration-ivory/30 underline-offset-4 hover:text-ivory sm:inline">
          About this demo
        </Link>
      </p>
    </div>
  );
}
