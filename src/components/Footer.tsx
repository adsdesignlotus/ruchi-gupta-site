import { navItems, site } from "@/lib/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-surface">
      <div className="mx-auto max-w-content px-page-mobile py-section-y md:px-page-tablet lg:px-page-desktop">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <a
              href="/"
              className="font-serif text-xl font-semibold tracking-heading text-text-primary transition-colors hover:text-accent"
            >
              {site.name}
            </a>
            <p className="mt-2 max-w-md text-sm text-text-secondary">
              {site.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-text-secondary transition-colors hover:text-accent"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-black/[0.06] pt-10">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-text-secondary transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <p className="mt-2 text-xs text-text-secondary">
            © {year} {site.name} · {site.instituteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
