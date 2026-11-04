import type { ReactNode } from "react";
import "./section-title.css";

type SectionTitleProps = {
  /** Small accent label (Portfilio `.section-title h2`). */
  label: string;
  /** Large display line (Portfilio `.section-title p`). */
  title: ReactNode;
  /** Page roots use h1; in-page sections use h2. */
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Owner identity mark from Portfilio — accent label + rule, then bold title.
 * Used on every major section / page intro.
 */
export default function SectionTitle({
  label,
  title,
  as = "h2",
  className,
}: SectionTitleProps) {
  const TitleTag = as;

  return (
    <div
      className={["km-section-title", className].filter(Boolean).join(" ")}
    >
      <p className="km-section-title__label">{label}</p>
      <TitleTag className="km-section-title__title">{title}</TitleTag>
    </div>
  );
}
