import { useCallback, useEffect, useState } from "react";
import { fetchSummary } from "../api.js";
import {
  localeLabel,
  mapRows,
  modeLabel,
  pathLabel,
  themeLabel,
} from "../labels.js";
import BarList from "../components/BarList.jsx";
import DailySpark from "../components/DailySpark.jsx";
import RecentTable from "../components/RecentTable.jsx";
import StatStrip from "../components/StatStrip.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function DashboardPage({ onLogout, mode, onToggleMode }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState("summary");
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const summary = await fetchSummary();
      setData(summary);
      setUpdatedAt(new Date());
    } catch (err) {
      if (err.status === 401) {
        onLogout();
        return;
      }
      setError("Could not load numbers. Try Refresh.");
    } finally {
      setBusy(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void load();
  }, [load]);

  const updatedLabel = updatedAt
    ? updatedAt.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const stickyMins = Math.round((data?.thresholds?.stickySeconds || 600) / 60);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/icons/logo-mark.png" width={28} height={28} alt="" />
          <div>
            <strong>Kaung Mon</strong>
            <span>Admin</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Sections">
          <button
            type="button"
            aria-current={section === "summary" ? "page" : undefined}
            onClick={() => setSection("summary")}
          >
            Summary
          </button>
          <button
            type="button"
            aria-current={section === "activity" ? "page" : undefined}
            onClick={() => setSection("activity")}
          >
            Recent activity
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>
              {section === "summary"
                ? "Who chose what — and who seems serious"
                : "What happened recently"}
            </h1>
            <p className="sub">
              {busy
                ? "Updating…"
                : updatedLabel
                  ? `Numbers as of ${updatedLabel}`
                  : "Waiting for data…"}
            </p>
          </div>
          <div className="admin-topbar__actions">
            <button
              type="button"
              className="ghost"
              onClick={() => void load()}
              disabled={busy}
            >
              Refresh numbers
            </button>
            <ThemeToggle mode={mode} onToggle={onToggleMode} />
            <button type="button" className="ghost" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </header>

        <div className="admin-content">
          {error ? <p className="empty">{error}</p> : null}
          {!data && !error ? <p className="boot">Loading…</p> : null}

          {data && section === "summary" ? (
            <>
              <StatStrip
                totals={data.totals}
                intentTotals={data.intentTotals}
              />

              <p className="analysis-note">
                “Seem to mean it” = stayed on one lens about {stickyMins}+
                minutes, came back with the same lens, or used a page that fits
                that lens (for example Resume while on Recruiter). “Tried several
                lenses” = switched lenses often without that signal.
              </p>

              <section className="panel-grid">
                <article className="panel">
                  <div className="panel__head">
                    <h2>Lens among people who seem serious</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.likelyByPath, pathLabel)} />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Lens among people who tried several</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.explorerByPath, pathLabel)} />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>First lens they chose</h2>
                  </div>
                  <div className="panel__body">
                    <BarList
                      rows={mapRows(
                        data.pathFirstEvents?.length
                          ? data.pathFirstEvents
                          : data.firstPathAll,
                        pathLabel,
                      )}
                    />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Later lens switches (landed on)</h2>
                  </div>
                  <div className="panel__body">
                    <BarList
                      rows={mapRows(data.pathSwitchEvents, pathLabel)}
                    />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Current lens (everyone)</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.byPath, pathLabel)} />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Color theme they use</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.byTheme, themeLabel)} />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Day or night</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.byMode, modeLabel)} />
                  </div>
                </article>
                <article className="panel">
                  <div className="panel__head">
                    <h2>Language</h2>
                  </div>
                  <div className="panel__body">
                    <BarList rows={mapRows(data.byLocale, localeLabel)} />
                  </div>
                </article>
                <article className="panel panel--wide">
                  <div className="panel__head">
                    <h2>Actions per day (last 30 days)</h2>
                  </div>
                  <div className="panel__body">
                    <DailySpark rows={data.daily} />
                  </div>
                </article>
              </section>
            </>
          ) : null}

          {data && section === "activity" ? (
            <section className="panel panel--wide">
              <div className="panel__head">
                <h2>Latest actions from the website</h2>
                <span className="meta">
                  Showing {data.recent?.length ?? 0}
                </span>
              </div>
              <RecentTable rows={data.recent} />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
