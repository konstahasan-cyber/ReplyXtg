import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Aurelia Grove concept website handles information, analytics, attribution data and demo form submissions.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="October 2026">
      <p className="border-l-2 border-terracotta bg-sand/50 px-5 py-4">
        <strong>Concept website notice.</strong> {company.name} is a fictional company. This policy describes how this
        demonstration site behaves. A real business must replace it with a policy reviewed by qualified counsel for its own
        practices and applicable law, including the California Consumer Privacy Act (CCPA/CPRA).
      </p>

      <h2>Information you provide</h2>
      <p>
        The Home Planner and consultation form ask for your name, email, optional phone number, ZIP code, preferred contact
        method and your project preferences. We ask only for what&apos;s needed to respond to you and understand your project.
      </p>
      <p>
        <strong>In this demo</strong>, submissions are validated by the website server and then stored only in your own
        browser&apos;s local storage so you can see what would have been sent. They are not emailed, not forwarded to a CRM and not
        shared with anyone. You can remove them by clearing this site&apos;s data in your browser.
      </p>

      <h2>How a live site would use your information</h2>
      <ul>
        <li>To reply to your inquiry using your preferred contact method.</li>
        <li>To prepare for a consultation about your project.</li>
        <li>To keep a record of our communication.</li>
      </ul>
      <p>Information would not be sold or shared for cross-context behavioral advertising.</p>

      <h2 id="analytics">Analytics and cookies</h2>
      <p>
        The site includes a first-party event layer that records interactions such as page views and form steps. Third-party
        analytics (for example Google Analytics 4 or Google Ads) are loaded only if they are configured <em>and</em> you
        choose &quot;Allow analytics&quot;. They are never loaded in demo mode. If your browser sends a Global Privacy Control
        signal, we treat it as an opt-out.
      </p>

      <h2>Attribution data</h2>
      <p>
        To understand which campaigns bring visitors, the site may store the first and most recent traffic source (such as UTM
        parameters and the referring website) in your browser for up to 90 days. This information stays on your device and is
        included only if you choose to submit a form. It is not stored when Global Privacy Control is enabled.
      </p>

      <h2>Experiments</h2>
      <p>
        We may test small variations of wording or layout. A first-party cookie keeps your experience consistent between
        visits. It contains only the variant letter, not personal information.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can decline analytics, clear stored data in your browser at any time, and — for a live site — request access to,
        correction of or deletion of personal information by contacting the business.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this demo policy: <a href={`mailto:${company.email}`}>{company.email}</a> (reserved example address — it
        does not reach a real mailbox).
      </p>
    </LegalPage>
  );
}
