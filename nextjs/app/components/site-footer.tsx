import { BRAND } from "../lib/media";
import { scrollToSection } from "../lib/scroll-section";
import {
  FOOTER_BLURB,
  FOOTER_NAV,
  SOCIAL_LINKS,
} from "../lib/visitor-paths";
import MediaImage from "./media-image";
import "./site-footer.css";

const logo = BRAND.logoMark;

type SiteFooterProps = {
  /** When true, invert the black source mark for dark canvases. */
  invertMark?: boolean;
  /** Hide Voices when that section isn’t on the page (e.g. Client lens). */
  showVoices?: boolean;
};

export default function SiteFooter({
  invertMark = false,
  showVoices = true,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const nav = FOOTER_NAV.filter(
    (item) => showVoices || !("section" in item) || item.section !== "voices",
  );

  return (
    <footer className="km-footer">
      <div className="km-footer__inner">
        <div className="km-footer__grid">
          <nav className="km-footer__nav" aria-label="Footer">
            {nav.map((item) =>
              "section" in item ? (
                <button
                  key={item.section}
                  type="button"
                  className="km-footer__link"
                  onClick={() => scrollToSection(item.section)}
                >
                  {item.label}
                </button>
              ) : (
                <a key={item.href} href={item.href} className="km-footer__link">
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="km-footer__brand">
            <button
              type="button"
              className="km-footer__lockup"
              aria-label="Kaung Mon, back to top"
              onClick={() => scrollToSection("top")}
            >
              <MediaImage
                src={logo}
                alt=""
                width={72}
                height={72}
                sizes="72px"
                quality={95}
                className={[
                  "km-footer__mark",
                  invertMark ? "km-media--invert" : "",
                ].join(" ")}
              />
              <span className="km-footer__name">Kaung Mon</span>
            </button>
            <p className="km-footer__blurb">{FOOTER_BLURB}</p>
            <div className="km-footer__social" aria-label="Social">
              <a
                href={SOCIAL_LINKS.youtube}
                className="km-footer__social-btn"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"
                  />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                className="km-footer__social-btn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.15V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8.5z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <p className="km-footer__copy">© {year} Kaung Mon</p>
      </div>
    </footer>
  );
}
