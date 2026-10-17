import { Breadcrumbs } from "@/components/ui/Section";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="bg-ivory">
      <div className="container-x max-w-4xl pb-28 pt-14 md:pt-20">
        <Breadcrumbs items={[{ name: title, path }]} tone="dark" />
        <h1 className="mt-10 text-h1 text-forest">{title}</h1>
        <p className="mt-4 text-sm text-stone">Last updated {updated}</p>
        <div className="legal mt-12 space-y-6 text-[1.02rem] leading-relaxed text-charcoal [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-14 [&_h2]:font-serif [&_h2]:text-[2rem] [&_h2]:leading-tight [&_h2]:text-forest [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </article>
  );
}
