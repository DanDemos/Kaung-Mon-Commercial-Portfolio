import Image from "next/image";
import { BRAND } from "../lib/media";
import "./site-loader.css";

type SiteLoaderProps = {
  /** When true, loader is fading out / gone from a11y tree. */
  ready: boolean;
};

/**
 * Boot gate — quiet brand + traditional spinner until theme prefs apply.
 * Logo stays the black source mark (never inverted).
 */
export default function SiteLoader({ ready }: SiteLoaderProps) {
  return (
    <div
      className={["km-loader", ready ? "km-loader--done" : ""].join(" ")}
      aria-hidden={ready}
      role={ready ? undefined : "status"}
      aria-live={ready ? undefined : "polite"}
      aria-label={ready ? undefined : "Loading"}
    >
      <div className="km-loader__brand">
        <div className="km-loader__mark">
          <Image
            src={BRAND.logoMark}
            alt=""
            width={72}
            height={72}
            priority
            className="km-loader__logo"
          />
        </div>
        <p className="km-loader__name" aria-hidden>
          Kaung Mon
        </p>
      </div>

      <span className="km-loader__spinner" aria-hidden />
    </div>
  );
}
