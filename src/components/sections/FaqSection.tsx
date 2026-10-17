import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/Section";
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd";
import { faqs as allFaqs, type Faq } from "@/config/content";

export function FaqSection({
  faqs = allFaqs,
  title = "Common Questions",
  lede = "Straight answers to the questions people ask before building a custom home. If yours isn't here, just ask.",
}: {
  faqs?: Faq[];
  title?: string;
  lede?: string;
}) {
  return (
    <section className="section-y bg-ivory" id="faq">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title={title} lede={lede} />
          <p data-reveal className="mt-8 text-sm text-stone">
            Still curious?{" "}
            <Link href="/contact" className="font-semibold text-forest underline decoration-terracotta underline-offset-4">
              Send us your question
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} analyticsEvent="faq_expand" />
        </div>
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </section>
  );
}
