"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { siteNavForPath } from "../lib/site-nav";
import {
  DEFAULT_PATH,
  PATH_CHANGE_EVENT,
  PATH_STORAGE_KEY,
  type VisitorPath,
} from "../lib/visitor-paths";
import "./draw-underline.css";
import "./site-destination-nav.css";

function readStoredPath(): VisitorPath {
  if (typeof window === "undefined") return DEFAULT_PATH;
  const raw = window.localStorage.getItem(PATH_STORAGE_KEY);
  if (
    raw === "hire" ||
    raw === "craft" ||
    raw === "build" ||
    raw === "wander"
  ) {
    return raw;
  }
  return DEFAULT_PATH;
}

function navLinkClass(active: boolean) {
  return [
    "km-site-nav__link",
    active ? "km-site-nav__link--active" : "km-draw-underline",
  ]
    .filter(Boolean)
    .join(" ");
}

function DestinationLinks({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const [path, setPath] = useState<VisitorPath>(DEFAULT_PATH);

  useEffect(() => {
    setPath(readStoredPath());

    function sync() {
      setPath(readStoredPath());
    }

    window.addEventListener("storage", sync);
    window.addEventListener(PATH_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PATH_CHANGE_EVENT, sync);
    };
  }, []);

  const items = siteNavForPath(path);

  return (
    <ul className={className}>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={navLinkClass(active)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Brand lockup + desktop page nav (Home · Work · Resume? · Contact). */
export function SiteNavLead({ children }: { children: ReactNode }) {
  return (
    <div className="km-site-header__lead">
      <div className="km-site-nav__brand">{children}</div>
      <nav className="km-site-nav km-site-nav--desktop" aria-label="Site pages">
        <DestinationLinks className="km-site-nav__list" />
      </nav>
    </div>
  );
}

/**
 * Mobile page links — lives inside the sticky header as row 2.
 * Not a second sticky layer (that caused scroll jitter).
 */
export function SiteNavStrip() {
  return (
    <nav className="km-site-nav km-site-nav--strip" aria-label="Site pages">
      <DestinationLinks className="km-site-nav__list km-site-nav__list--strip" />
    </nav>
  );
}
