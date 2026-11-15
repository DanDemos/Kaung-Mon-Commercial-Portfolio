export default function StatStrip({ totals = {}, intentTotals = {} }) {
  const items = [
    {
      value: totals.visitors ?? 0,
      label: "People",
      hint: "Browsers that sent data",
    },
    {
      value: intentTotals.likely ?? 0,
      label: "Seem to mean it",
      hint: "Stayed on a lens or used it",
    },
    {
      value: intentTotals.explorer ?? 0,
      label: "Tried several lenses",
      hint: "Switched around a lot",
    },
    {
      value: intentTotals.unclear ?? 0,
      label: "Too early to tell",
      hint: "Not enough time or actions",
    },
  ];

  return (
    <section className="kpis" aria-live="polite">
      {items.map((item) => (
        <div className="kpi" key={item.label}>
          <span className="kpi__label">{item.label}</span>
          <span className="kpi__value mono">{item.value}</span>
          <span className="kpi__hint">{item.hint}</span>
        </div>
      ))}
    </section>
  );
}
