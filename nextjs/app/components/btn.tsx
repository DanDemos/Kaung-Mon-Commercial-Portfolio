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

function BtnChrome({ children }: { children: ReactNode }) {
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
      <span className="km-btn__label">{children}</span>
    </>
  );
}

function classes(className?: string) {
  return ["km-btn", className].filter(Boolean).join(" ");
}

/**
 * Default site button — same treatment as the hero “Start browsing” control.
 */
export default function Btn(props: BtnProps) {
  if (props.section) {
    const { children, className, section, onClick, ...buttonRest } = props;
    return (
      <button
        type="button"
        className={classes(className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) scrollToSection(section);
        }}
        {...buttonRest}
      >
        <BtnChrome>{children}</BtnChrome>
      </button>
    );
  }

  if (typeof props.href === "string") {
    const { children, className, href, ...anchorRest } = props;
    return (
      <a href={href} className={classes(className)} {...anchorRest}>
        <BtnChrome>{children}</BtnChrome>
      </a>
    );
  }

  const { children, className, type = "button", ...buttonRest } = props;
  return (
    <button type={type} className={classes(className)} {...buttonRest}>
      <BtnChrome>{children}</BtnChrome>
    </button>
  );
}
