"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  EventPhotoLinkEntry,
  EventPhotoLinksMap,
} from "@/lib/event-photo-links-store";

type Props = {
  slugLabels: Record<string, string>;
};

function emptyEntry(): EventPhotoLinkEntry {
  return { enabled: false, googleDriveUrl: "", cloudinaryUrl: "" };
}

export function AdminEventPhotosApp({ slugLabels }: Props) {
  const slugs = useMemo(
    () => Object.keys(slugLabels).sort(),
    [slugLabels],
  );

  const [password, setPassword] = useState("");
  const [session, setSession] = useState<"unknown" | "in" | "out">("unknown");
  const [map, setMap] = useState<EventPhotoLinksMap | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadConfig = useCallback(async () => {
    setMessage(null);
    const r = await fetch("/api/admin/photo-links");
    if (r.status === 401) {
      setSession("out");
      setMap(null);
      return;
    }
    const j = (await r.json()) as {
      ok?: boolean;
      map?: EventPhotoLinksMap;
      error?: string;
    };
    if (!j.ok || !j.map) {
      setSession("out");
      setMessage(j.error ?? "Could not load settings.");
      return;
    }
    setSession("in");
    setMap(j.map);
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !j.ok) {
        setMessage(j.error ?? "Login failed.");
        return;
      }
      setPassword("");
      await loadConfig();
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setSession("out");
      setMap(null);
    } finally {
      setBusy(false);
    }
  };

  const updateRow = (slug: string, patch: Partial<EventPhotoLinkEntry>) => {
    setMap((prev) => {
      const base = prev ?? {};
      const cur = base[slug] ?? emptyEntry();
      return { ...base, [slug]: { ...cur, ...patch } };
    });
  };

  const save = async () => {
    if (!map) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await fetch("/api/admin/photo-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ map }),
      });
      const j = (await r.json()) as {
        ok?: boolean;
        map?: EventPhotoLinksMap;
        error?: string;
      };
      if (!r.ok || !j.ok) {
        setMessage(j.error ?? "Save failed.");
        return;
      }
      if (j.map) setMap(j.map);
      setMessage("Saved.");
    } finally {
      setBusy(false);
    }
  };

  if (session === "unknown" && !message) {
    return (
      <p className="text-sm text-text-secondary" role="status">
        Loading…
      </p>
    );
  }

  if (session === "out") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <p className="text-sm leading-relaxed text-text-secondary">
          Sign in to show or hide public &ldquo;More photos&rdquo; links (Google
          Drive and Cloudinary) on each event page.
        </p>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-black/[0.12] bg-background px-3 py-2 text-sm text-text-primary outline-none ring-accent focus:ring-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-maroon px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {message ? (
          <p className="text-sm text-maroon" role="alert">
            {message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">
          Toggle visibility and paste HTTPS links. Visitors only see this block
          when <span className="font-medium text-text-primary">Show on site</span>{" "}
          is on and at least one URL is set.
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={busy}
          className="text-sm font-medium text-text-secondary underline-offset-2 hover:text-accent hover:underline disabled:opacity-50"
        >
          Sign out
        </button>
      </div>

      {message ? (
        <p
          className={
            message === "Saved."
              ? "text-sm text-text-secondary"
              : "text-sm text-maroon"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded border border-black/[0.08]">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.08] bg-black/[0.02]">
              <th className="p-3 font-semibold text-text-primary">Event</th>
              <th className="p-3 font-semibold text-text-primary">Show</th>
              <th className="p-3 font-semibold text-text-primary">
                Google Drive URL
              </th>
              <th className="p-3 font-semibold text-text-primary">
                Cloudinary URL
              </th>
            </tr>
          </thead>
          <tbody>
            {slugs.map((slug) => {
              const row = map?.[slug] ?? emptyEntry();
              const title = slugLabels[slug] ?? slug;
              return (
                <tr
                  key={slug}
                  className="border-b border-black/[0.06] align-top last:border-b-0"
                >
                  <td className="p-3">
                    <div className="font-medium text-text-primary">{title}</div>
                    <div className="mt-0.5 font-mono text-xs text-text-secondary">
                      {slug}
                    </div>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) =>
                        updateRow(slug, { enabled: e.target.checked })
                      }
                      aria-label={`Show photo links for ${title}`}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="url"
                      value={row.googleDriveUrl}
                      onChange={(e) =>
                        updateRow(slug, { googleDriveUrl: e.target.value })
                      }
                      placeholder="https://drive.google.com/…"
                      className="w-full min-w-[200px] rounded border border-black/[0.12] bg-background px-2 py-1.5 font-mono text-xs text-text-primary outline-none ring-accent focus:ring-2"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="url"
                      value={row.cloudinaryUrl}
                      onChange={(e) =>
                        updateRow(slug, { cloudinaryUrl: e.target.value })
                      }
                      placeholder="https://res.cloudinary.com/…"
                      className="w-full min-w-[200px] rounded border border-black/[0.12] bg-background px-2 py-1.5 font-mono text-xs text-text-primary outline-none ring-accent focus:ring-2"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => void save()}
        disabled={busy || !map}
        className="rounded bg-maroon px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
