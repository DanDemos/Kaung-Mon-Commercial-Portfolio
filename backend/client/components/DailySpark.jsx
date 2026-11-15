export default function DailySpark({ rows }) {
  if (!rows?.length) {
    return <p className="empty">No events in the last 30 days.</p>;
  }

  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="spark">
      {rows.map((r) => (
        <span
          key={r.day}
          title={`${r.day}: ${r.count}`}
          style={{ height: `${Math.max(8, (r.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
