import "./site-loader.css";

type SiteLoaderProps = {
  /** When true, loader is fading out / gone from a11y tree. */
  ready: boolean;
};

/**
 * Boot gate UI — covers first paint until theme prefs + tokens are applied.
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
      <div className="km-loader__mark" aria-hidden>
        <span className="km-loader__pulse" />
      </div>
      <p className="km-loader__label">Kaung Mon</p>
    </div>
  );
}
