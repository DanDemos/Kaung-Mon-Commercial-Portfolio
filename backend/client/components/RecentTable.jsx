import {
  eventLabel,
  localeLabel,
  modeLabel,
  pathLabel,
  themeLabel,
} from "../labels.js";

function shortId(id) {
  if (!id) return "—";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}

export default function RecentTable({ rows }) {
  if (!rows?.length) {
    return (
      <p className="empty">
        Nothing here yet. Open the portfolio site with analytics turned on,
        then come back and press Refresh numbers.
      </p>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>What they did</th>
            <th>Lens</th>
            <th>Color theme</th>
            <th>Day / night</th>
            <th>Language</th>
            <th>Person</th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td className="mono">{e.created_at}</td>
              <td>{eventLabel(e.type)}</td>
              <td>{e.path ? pathLabel(e.path) : "—"}</td>
              <td>{e.theme ? themeLabel(e.theme) : "—"}</td>
              <td>{e.mode ? modeLabel(e.mode) : "—"}</td>
              <td>{e.locale ? localeLabel(e.locale) : "—"}</td>
              <td className="mono" title={e.visitor_id}>
                {shortId(e.visitor_id)}
              </td>
              <td className="mono">{e.page || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
