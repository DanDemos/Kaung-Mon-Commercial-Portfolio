import Btn from "./btn";
import SectionTitle from "./section-title";
import "./contact-invite.css";

type ContactInviteProps = {
  eyebrow?: string;
  title: string;
  /** Body under the title. Use `\n` for separate lines (About-style stack). */
  support: string;
  ctaLabel: string;
};

/**
 * Home contact teaser — same layout language as About (no card).
 * Form lives on `/contact`.
 */
export default function ContactInvite({
  eyebrow,
  title,
  support,
  ctaLabel,
}: ContactInviteProps) {
  const lines = support
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="km-contact-invite">
      <div className="km-contact-invite__head">
        <SectionTitle label={eyebrow?.trim() || "Contact"} title={title} />
      </div>
      <div className="km-contact-invite__body">
        {lines.map((line) => (
          <p key={line} className="km-contact-invite__line">
            {line}
          </p>
        ))}
        <Btn href="/contact">{ctaLabel}</Btn>
      </div>
    </div>
  );
}
