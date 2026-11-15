/**
 * Pantone Color of the Year archive (approximate screen HEX).
 * Pantone does not publish an official public HEX API; values are
 * widely used TCX screen approximations for digital UI only.
 *
 * When Pantone announces a new year, add one entry here — the UI
 * automatically picks current year + previous two.
 */
export type PantoneCoty = {
  year: number;
  name: string;
  code: string;
  hex: string;
};

export const PANTONE_COTY: PantoneCoty[] = [
  { year: 2026, name: "Cloud Dancer", code: "11-4201", hex: "#F0EEE9" },
  { year: 2025, name: "Mocha Mousse", code: "17-1230", hex: "#A47864" },
  { year: 2024, name: "Peach Fuzz", code: "13-1023", hex: "#FFBE98" },
  { year: 2023, name: "Viva Magenta", code: "18-1750", hex: "#BB2649" },
  { year: 2022, name: "Very Peri", code: "17-3938", hex: "#6667AB" },
  { year: 2021, name: "Ultimate Gray", code: "17-5104", hex: "#939597" },
  { year: 2020, name: "Classic Blue", code: "19-4052", hex: "#0F4C81" },
  { year: 2019, name: "Living Coral", code: "16-1546", hex: "#FF6F61" },
  { year: 2018, name: "Ultra Violet", code: "18-3838", hex: "#5F4B8B" },
  { year: 2017, name: "Greenery", code: "15-0343", hex: "#88B04B" },
];

export function cotyByYear(year: number): PantoneCoty | undefined {
  return PANTONE_COTY.find((entry) => entry.year === year);
}

/** Latest N Colors of the Year at or before `year` (newest first). */
export function recentCoty(count: number, year = new Date().getFullYear()): PantoneCoty[] {
  return PANTONE_COTY.filter((entry) => entry.year <= year)
    .sort((a, b) => b.year - a.year)
    .slice(0, count);
}
