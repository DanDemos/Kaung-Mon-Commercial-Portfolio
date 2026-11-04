import "./focus-rail.css";

type FocusItem = {
  title: string;
  body: string;
};

type FocusRailProps = {
  items: FocusItem[];
  label?: string;
};

/**
 * Focus pillars — all visible. No segmented track / click-to-reveal.
 */
export default function FocusRail({
  items,
  label = "Focus areas",
}: FocusRailProps) {
  if (items.length === 0) return null;

  return (
    <ul className="km-focus-rail" aria-label={label}>
      {items.map((item) => (
        <li key={item.title} className="km-focus-rail__panel">
          <h3 className="km-focus-rail__title">{item.title}</h3>
          <p className="km-focus-rail__body">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
