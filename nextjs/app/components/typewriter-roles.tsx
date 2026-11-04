"use client";

import { useEffect, useState } from "react";
import "./typewriter-roles.css";

type TypewriterRolesProps = {
  roles: string[];
  /** ms per character while typing */
  typeMs?: number;
  /** ms per character while deleting */
  deleteMs?: number;
  /** pause when a word is fully typed */
  holdMs?: number;
};

/**
 * Quiet rotating role line under the brand.
 * Respects prefers-reduced-motion: shows the first role, no animation.
 */
export default function TypewriterRoles({
  roles,
  typeMs = 42,
  deleteMs = 28,
  holdMs = 1600,
}: TypewriterRolesProps) {
  const roleKey = roles.join("|");
  const safeRoles = roles.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(safeRoles[0] ?? "");
  const [phase, setPhase] = useState<"type" | "hold" | "delete">("hold");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    function onChange() {
      setReduced(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Reset when the path swaps the role list.
  useEffect(() => {
    setIndex(0);
    setText(safeRoles[0] ?? "");
    setPhase("hold");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roleKey is the intentional trigger
  }, [roleKey]);

  useEffect(() => {
    if (reduced || safeRoles.length <= 1) return;
    const full = safeRoles[index % safeRoles.length] ?? "";

    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("delete"), holdMs);
      return () => window.clearTimeout(t);
    }

    if (phase === "delete") {
      if (text.length === 0) {
        setIndex((i) => (i + 1) % safeRoles.length);
        setPhase("type");
        return;
      }
      const t = window.setTimeout(
        () => setText((current) => current.slice(0, -1)),
        deleteMs,
      );
      return () => window.clearTimeout(t);
    }

    // type
    if (text === full) {
      setPhase("hold");
      return;
    }
    const t = window.setTimeout(
      () => setText(full.slice(0, text.length + 1)),
      typeMs,
    );
    return () => window.clearTimeout(t);
  }, [phase, text, index, roleKey, typeMs, deleteMs, holdMs, reduced, safeRoles]);

  if (safeRoles.length === 0) return null;

  const display = reduced || safeRoles.length === 1 ? safeRoles[0] : text;

  return (
    <p className="km-typewriter" aria-live="polite">
      <span className="km-typewriter__text">{display}</span>
      {!reduced ? <span className="km-typewriter__caret" aria-hidden /> : null}
    </p>
  );
}
