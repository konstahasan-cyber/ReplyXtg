import Image from "next/image";
import Link from "next/link";
import { ConceptLabel } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { formatSqft, type ConceptProject } from "@/config/projects";

export function ProjectCard({
  project,
  index,
  size = "default",
  headingLevel = "h3",
}: {
  project: ConceptProject;
  index?: number;
  size?: "default" | "large";
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <article className="group relative">
      <div
        data-reveal="image"
        className={`relative overflow-hidden bg-sand ${size === "large" ? "aspect-[4/5] md:aspect-[16/11]" : "aspect-[4/5]"}`}
      >
        <Image
          src={project.images[0].src}
          alt={project.images[0].alt}
          fill
          sizes={size === "large" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <ConceptLabel className="absolute left-4 top-4" />
      </div>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          {index !== undefined && <p className="eyebrow text-clay">{String(index + 1).padStart(2, "0")} · {project.style}</p>}
          <H className="mt-3 text-h3 text-forest">
            <Link href={`/home-designs/${project.slug}`} className="after:absolute after:inset-0">
              {project.name}
            </Link>
          </H>
          <p className="mt-2 text-sm text-stone">
            {project.location} · {formatSqft(project.sqft)} · {project.bedrooms} bd · {project.bathrooms} ba
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-ivory"
        >
          <Arrow className="w-5" />
        </span>
      </div>
    </article>
  );
}
