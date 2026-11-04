import Btn from "./btn";
import SectionTitle from "./section-title";
import "./contact-invite.css";

type ContactInviteProps = {
  eyebrow?: string;
  title: string;
  support: string;
  ctaLabel: string;
};

/**
 * Home contact teaser — leads to `/contact` (form lives there).
 * Uses Portfilio section-title identity; Client keeps “Are you ready?” label.
 */
export default function ContactInvite({
  eyebrow,
  title,
  support,
  ctaLabel,
}: ContactInviteProps) {
  return (
    <div className="km-contact-invite">
      <div className="km-contact-invite__copy">
        <SectionTitle label={eyebrow?.trim() || "Contact"} title={title} />
        <p className="km-contact-invite__support">{support}</p>
      </div>
      <div className="km-contact-invite__action">
        <Btn href="/contact">{ctaLabel}</Btn>
      </div>
    </div>
  );
}
