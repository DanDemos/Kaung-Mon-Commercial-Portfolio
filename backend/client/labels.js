/** Plain-language labels for stored values — no admin jargon. */

const PATH_LABELS = {
  wander: "Wonderer",
  hire: "Recruiter",
  craft: "Developer / Designer",
  build: "Client",
};

const MODE_LABELS = {
  light: "Day",
  dark: "Night",
};

const LOCALE_LABELS = {
  en: "English",
  my: "Myanmar",
};

const EVENT_LABELS = {
  session_start: "Opened the site",
  path: "Changed lens",
  path_first: "Chose a lens (first time)",
  path_switch: "Switched to another lens",
  theme: "Changed color theme",
  mode: "Switched day / night",
  locale: "Changed language",
  chooser_seen: "Finished the lens chooser",
  page_view: "Opened a page",
  heartbeat: "Still on the site",
};

const INTENT_LABELS = {
  likely: "Seem to mean their lens",
  explorer: "Tried several lenses",
  unclear: "Not enough signal yet",
};

export function pathLabel(value) {
  if (!value || value === "(unset)") return "Not set yet";
  return PATH_LABELS[value] || value;
}

export function modeLabel(value) {
  if (!value || value === "(unset)") return "Not set yet";
  return MODE_LABELS[value] || value;
}

export function localeLabel(value) {
  if (!value || value === "(unset)") return "Not set yet";
  return LOCALE_LABELS[value] || value;
}

export function themeLabel(value) {
  if (!value || value === "(unset)") return "Not set yet";
  if (value === "young-night") return "Young Night";
  if (value === "custom") return "Custom color";
  if (value.startsWith("coty-")) return `Pantone ${value.slice(5)}`;
  return value;
}

export function eventLabel(value) {
  return EVENT_LABELS[value] || value;
}

export function intentLabel(value) {
  return INTENT_LABELS[value] || value;
}

/** Relabel chart rows: { key, count } → human key */
export function mapRows(rows, labelFn) {
  if (!rows?.length) return rows;
  return rows.map((r) => ({ ...r, key: labelFn(r.key) }));
}
