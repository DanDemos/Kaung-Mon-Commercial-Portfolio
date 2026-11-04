"use client";

import { useState } from "react";
import Btn from "./btn";
import TextLink from "./text-link";
import "./contact-dock.css";

type ContactDockProps = {
  title: string;
  support: string;
  email: string;
  mailto: string;
};

/**
 * Contact as a control surface — copy + mail actions, not a lonely text link.
 */
export default function ContactDock({
  title,
  support,
  email,
  mailto,
}: ContactDockProps) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback: still offer mailto
      window.location.href = mailto;
    }
  }

  return (
    <div className="km-contact-dock">
      <div className="km-contact-dock__glow" aria-hidden />
      <div className="km-contact-dock__copy">
        <h2 className="km-contact-dock__title">{title}</h2>
        <p className="km-contact-dock__support">{support}</p>
      </div>

      <div className="km-contact-dock__well">
        <p className="km-contact-dock__email" aria-label={`Email ${email}`}>
          {email}
        </p>
        <div className="km-contact-dock__actions">
          <Btn href={mailto}>Email me</Btn>
          <TextLink type="button" onClick={copyEmail}>
            {copied ? "Copied" : "Copy email"}
          </TextLink>
        </div>
      </div>
    </div>
  );
}
