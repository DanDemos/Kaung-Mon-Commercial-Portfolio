"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startAnalyticsListeners, trackAnalytics } from "../lib/analytics";

/** Soft preference + intent telemetry — mounts once in the root layout. */
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const skipNextPageView = useRef(true);

  useEffect(() => {
    return startAnalyticsListeners(pathname || "/");
    // Boot once — further page views tracked below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (skipNextPageView.current) {
      skipNextPageView.current = false;
      return;
    }
    trackAnalytics("page_view", {}, { route: pathname });
  }, [pathname]);

  return null;
}
