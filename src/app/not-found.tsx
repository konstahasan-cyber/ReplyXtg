import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-ivory">
      <div className="container-x flex min-h-[70svh] flex-col items-start justify-center py-24">
        <p className="eyebrow text-clay">Error 404</p>
        <h1 className="mt-5 max-w-2xl text-h1 text-forest">This room hasn&apos;t been built yet.</h1>
        <p className="mt-6 max-w-xl text-lede text-stone">The page you&apos;re looking for may have moved. Here are a few good places to continue.</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/home-designs" variant="outline">
            Explore Home Designs
          </ButtonLink>
        </div>
        <Link href="/contact" className="link-underline mt-8 text-sm font-semibold text-forest">
          Or send us a message →
        </Link>
      </div>
    </section>
  );
}
