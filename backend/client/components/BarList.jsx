export default function BarList({ rows }) {
  if (!rows?.length) {
    return <p className="empty">No data yet.</p>;
  }

  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="bars">
      {rows.map((r) => (
        <div className="bar-row" key={r.key}>
          <span className="label" title={r.key}>
            {r.key}
          </span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(r.count / max) * 100}%` }}
            />
          </div>
          <span className="count">{r.count}</span>
        </div>
      ))}
    </div>
  );
}
