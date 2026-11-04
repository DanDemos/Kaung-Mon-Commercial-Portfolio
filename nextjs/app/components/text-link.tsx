import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import {
  scrollToSection,
  type PageSection,
} from "../lib/scroll-section";
import "./text-link.css";

type SharedProps = {
  children: ReactNode;
  className?: string;
};

type TextLinkAsSection = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "href" | "type"> & {
    section: PageSection;
    href?: undefined;
  };

type TextLinkAsAnchor = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    section?: undefined;
  };

type TextLinkAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "href"> & {
    href?: undefined;
    section?: undefined;
  };

export type TextLinkProps = TextLinkAsSection | TextLinkAsAnchor | TextLinkAsButton;

function classes(className?: string) {
  return ["km-text-link", className].filter(Boolean).join(" ");
}

/**
 * Secondary action — underlined text. Use beside a single `Btn`, never as a twin primary.
 */
export default function TextLink(props: TextLinkProps) {
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
        {children}
      </button>
    );
  }

  if (typeof props.href === "string") {
    const { children, className, href, ...anchorRest } = props;
    return (
      <a href={href} className={classes(className)} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { children, className, type = "button", ...buttonRest } = props;
  return (
    <button type={type} className={classes(className)} {...buttonRest}>
      {children}
    </button>
  );
}
