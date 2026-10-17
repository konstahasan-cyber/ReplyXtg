import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use and demo notice for the Aurelia Grove Custom Homes concept website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="October 2026">
      <section id="demo" className="scroll-mt-28 border border-forest/25 bg-white p-6 md:p-8">
        <h2 className="mt-0!">Demo notice</h2>
        <p className="mt-4">
          This website is a <strong>concept project</strong> created to demonstrate premium web design, UX and conversion
          strategy. {company.name} is a <strong>fictional company</strong>.
        </p>
        <ul className="mt-4">
          <li>The phone number {company.phone.display} uses a range reserved for fictional use.</li>
          <li>The domain {company.website} and email address use the reserved .example top-level domain.</li>
          <li>
            The license shown ({company.license.value}) is a placeholder and <strong>not a valid contractor license</strong>. No
            claim of licensing, bonding or insurance is made.
          </li>
          <li>The homes shown are fictional concept designs illustrated with original procedural renderings, not completed projects.</li>
          <li>There are no testimonials, ratings, awards or certifications on this site, because none exist for a fictional company.</li>
          <li>Form submissions are saved only in your browser and are not sent to any company.</li>
        </ul>
      </section>

      <h2>Use of this site</h2>
      <p>
        Content on this site is provided for demonstration and general information. It is not professional, legal,
        architectural, engineering or permitting advice. Costs, timelines and requirements for real projects vary by lot,
        design and jurisdiction.
      </p>

      <h2>No offer or contract</h2>
      <p>
        Nothing on this site is an offer to provide construction services, a quote or a binding estimate. Budget ranges in the
        Home Planner are the visitor&apos;s own planning preferences.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The design, text, logo and renderings on this site were created for this concept. Do not present them as representing
        a real, licensed business.
      </p>

      <h2>Limitation of liability</h2>
      <p>The site is provided &quot;as is&quot; without warranties of any kind, to the fullest extent permitted by law.</p>

      <h2>For real businesses</h2>
      <p>
        A real builder adapting this site must replace these terms with ones reviewed by qualified counsel and must display
        accurate company, license and contact information as required by California law.
      </p>
    </LegalPage>
  );
}
