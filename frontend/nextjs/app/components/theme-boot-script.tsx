"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

/**
 * Injects the pre-paint theme boot into the SSR HTML stream outside the
 * React client tree — avoids React 19's "Encountered a script tag" warning
 * that fires for next/script and raw <script> in the component tree.
 */
export function ThemeBootScript({ script }: { script: string }) {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return (
      <script
        id="km-theme-boot"
        dangerouslySetInnerHTML={{ __html: script }}
      />
    );
  });

  return null;
}
