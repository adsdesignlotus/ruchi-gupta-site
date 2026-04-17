import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  subtitle,
  id,
  className,
}: {
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-10 md:mb-14", className)}>
      <h2
        id={id}
        className="font-serif text-section-title font-semibold tracking-heading text-text-primary"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
