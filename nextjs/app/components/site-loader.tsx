import Image from "next/image";
import { BRAND } from "../lib/media";
import "./site-loader.css";

type SiteLoaderProps = {
  /** When true, loader is fading out / gone from a11y tree. */
  ready: boolean;
  /** Invert black source mark for dark canvases. */
  invertMark?: boolean;
};

/**
 * Boot gate — brand reveal until theme prefs + tokens are applied.
 */
export default function SiteLoader({
  ready,
  invertMark = false,
}: SiteLoaderProps) {
  return (
    <div
      className={["km-loader", ready ? "km-loader--done" : ""].join(" ")}
      aria-hidden={ready}
      role={ready ? undefined : "status"}
      aria-live={ready ? undefined : "polite"}
      aria-label={ready ? undefined : "Loading"}
    >
      <div className="km-loader__atmosphere" aria-hidden />

      <div className="km-loader__stage" aria-hidden>
        <span className="km-loader__orbit km-loader__orbit--outer" />
        <span className="km-loader__orbit km-loader__orbit--inner" />
        <span className="km-loader__sweep" />
        <div className="km-loader__mark">
          <Image
            src={BRAND.logoMark}
            alt=""
            width={72}
            height={72}
            priority
            className={[
              "km-loader__logo",
              invertMark ? "km-loader__logo--invert" : "",
            ].join(" ")}
          />
        </div>
      </div>

      <p className="km-loader__name" aria-hidden>
        <span className="km-loader__glyph">K</span>
        <span className="km-loader__glyph">a</span>
        <span className="km-loader__glyph">u</span>
        <span className="km-loader__glyph">n</span>
        <span className="km-loader__glyph">g</span>
        <span className="km-loader__space" />
        <span className="km-loader__glyph">M</span>
        <span className="km-loader__glyph">o</span>
        <span className="km-loader__glyph">n</span>
      </p>
    </div>
  );
}
