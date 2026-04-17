"use client";

import { useState } from "react";
import { LogoMark } from "./Watermark";
import { navItems, site } from "@/lib/site";

export function Nav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-black/[0.06] bg-background/85 backdrop-blur-md"
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto max-w-content px-page-mobile md:px-page-tablet lg:px-page-desktop">
        <div className="flex h-14 items-center justify-between md:h-16">
          <a
            className="hover-brightness flex items-end gap-0 font-serif text-lg font-semibold tracking-heading text-text-primary transition-colors hover:text-accent md:text-xl"
            href="/"
            onClick={() => setOpen(false)}
          >
            <LogoMark />
            <span className="flex h-12 items-center justify-center font-serif text-[1.75rem] font-medium leading-none tracking-heading md:h-14 md:text-[2.125rem]">
              {site.name}
            </span>
          </a>
          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  className={`text-sm transition-colors hover:text-accent ${
                    isActive(href)
                      ? "font-semibold text-text-primary"
                      : "text-text-secondary"
                  }`}
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="-mr-2 p-2 text-text-primary transition-colors hover:text-accent md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-black/[0.06] transition-all duration-200 md:hidden ${
            open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
          hidden={!open}
        >
          <ul className="flex flex-col gap-1 py-4">
            <li>
              <a
                className={`block py-2 transition-colors hover:text-accent ${
                  pathname === "/"
                    ? "font-semibold text-text-primary"
                    : "text-text-secondary"
                }`}
                href="/"
                onClick={() => setOpen(false)}
              >
                Home
              </a>
            </li>
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  className={`block py-2 transition-colors hover:text-accent ${
                    isActive(href)
                      ? "font-semibold text-text-primary"
                      : "text-text-secondary"
                  }`}
                  href={href}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
