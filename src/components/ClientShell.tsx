"use client";

import type { ReactNode } from "react";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ClientShell({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  return (
    <ImagePreviewProvider>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav pathname={pathname} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ImagePreviewProvider>
  );
}
