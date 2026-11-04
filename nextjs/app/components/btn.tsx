import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import {
  scrollToSection,
  type PageSection,
} from "../lib/scroll-section";
import "./btn.css";

type SharedProps = {
  children: ReactNode;
  className?: string;
  /** Swap label for a spinner; label stays in the layout so size doesn’t jump. */
  busy?: boolean;
};

type BtnAsSection = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "href" | "type"> & {
    /** In-page target — scrolls without writing `#…` into the URL. */
    section: PageSection;
    href?: undefined;
  };

type BtnAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    section?: undefined;
  };

type BtnAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "href"> & {
    href?: undefined;
    section?: undefined;
  };

export type BtnProps = BtnAsSection | BtnAsLink | BtnAsButton;

function BtnChrome({
  children,
  busy = false,
}: {
  children: ReactNode;
  busy?: boolean;
}) {
  return (
    <>
      <span className="km-btn__edge" aria-hidden />
      <span className="km-btn__edge" aria-hidden />
      <span className="km-btn__edge" aria-hidden />
      <span className="km-btn__edge" aria-hidden />
      <span className="km-btn__hold" aria-hidden />
      <span className="km-btn__hold" aria-hidden />
      <span className="km-btn__hold" aria-hidden />
      <span className="km-btn__hold" aria-hidden />
      <span className="km-btn__label">
        <span
          className={[
            "km-btn__label-text",
            busy ? "km-btn__label-text--busy" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </span>
        {busy ? <span className="km-btn__spinner" aria-hidden /> : null}
      </span>
    </>
  );
}

function classes(className?: string, busy?: boolean) {
  return ["km-btn", busy ? "km-btn--busy" : "", className]
    .filter(Boolean)
    .join(" ");
}

/**
 * Default site button — same treatment as the hero “Start browsing” control.
 */
export default function Btn(props: BtnProps) {
  if (props.section) {
    const { children, className, section, onClick, busy, ...buttonRest } =
      props;
    return (
      <button
        type="button"
        className={classes(className, busy)}
        aria-busy={busy || undefined}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) scrollToSection(section);
        }}
        {...buttonRest}
      >
        <BtnChrome busy={busy}>{children}</BtnChrome>
      </button>
    );
  }

  if (typeof props.href === "string") {
    const { children, className, href, busy, ...anchorRest } = props;
    return (
      <a
        href={href}
        className={classes(className, busy)}
        aria-busy={busy || undefined}
        {...anchorRest}
      >
        <BtnChrome busy={busy}>{children}</BtnChrome>
      </a>
    );
  }

  const { children, className, type = "button", busy, ...buttonRest } = props;
  return (
    <button
      type={type}
      className={classes(className, busy)}
      aria-busy={busy || undefined}
      {...buttonRest}
    >
      <BtnChrome busy={busy}>{children}</BtnChrome>
    </button>
  );
}
