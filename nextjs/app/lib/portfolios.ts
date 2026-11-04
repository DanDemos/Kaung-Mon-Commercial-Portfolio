/**
 * Full works index for `/work`.
 * Covers live under `assets/portfolios/{slug}/cover.*`.
 * Optional `master.mp4` in the same folder feeds home walkthroughs (via public/media).
 */

import type { StaticImageData } from "next/image";

import animeMmSub from "../../../assets/portfolios/anime-mm-sub/cover.jpg";
import avs from "../../../assets/portfolios/avs/cover.jpg";
import blackWizard from "../../../assets/portfolios/black-wizard/cover.gif";
import c2 from "../../../assets/portfolios/c2/cover.jpg";
import cheese from "../../../assets/portfolios/cheese/cover.jpg";
import chikanero from "../../../assets/portfolios/chikanero/cover.jpg";
import dungeon from "../../../assets/portfolios/dungeon/cover.jpg";
import essential from "../../../assets/portfolios/essential/cover.jpg";
import finalPrototypeDay from "../../../assets/portfolios/final-prototype-day/cover.jpg";
import finalPrototypeNight from "../../../assets/portfolios/final-prototype-night/cover.jpg";
import genesis from "../../../assets/portfolios/genesis/cover.jpg";
import hndProject from "../../../assets/portfolios/hnd-project/cover.jpg";
import hwt from "../../../assets/portfolios/hwt/cover.jpg";
import iaConqueror from "../../../assets/portfolios/ia-conqueror/cover.jpg";
import kmd from "../../../assets/portfolios/kmd/cover.jpg";
import myanBell from "../../../assets/portfolios/myan-bell/cover.jpg";
import myanBellChatbot from "../../../assets/portfolios/myan-bell-chatbot/cover.jpg";
import myanGate from "../../../assets/portfolios/myan-gate/cover.jpg";
import myanProSolutions from "../../../assets/portfolios/myan-pro-solutions/cover.jpg";
import potion from "../../../assets/portfolios/potion/cover.jpg";
import rubiksCube from "../../../assets/portfolios/rubiks-cube/cover.jpg";
import seiNoGlasses from "../../../assets/portfolios/sei-no-glasses/cover.jpg";
import slime from "../../../assets/portfolios/slime/cover.gif";
import slimeAttack from "../../../assets/portfolios/slime-attack/cover.gif";
import tsukasaTsukuyomi from "../../../assets/portfolios/tsukasa-tsukuyomi/cover.jpg";
import wizard from "../../../assets/portfolios/wizard/cover.jpg";
import wizardStudy from "../../../assets/portfolios/wizard-study/cover.jpg";
import yorkYoga from "../../../assets/portfolios/york-yoga/cover.jpg";
import zeus from "../../../assets/portfolios/zeus/cover.gif";
import zeusAttack from "../../../assets/portfolios/zeus-attack/cover.gif";

export type PortfolioCategory =
  | "web"
  | "app"
  | "chatbot"
  | "designs"
  | "mmd";

export type PortfolioItem = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  cover: StaticImageData;
  /** True when a home walkthrough video exists under public/media/projects. */
  hasWalkthrough?: boolean;
};

export const PORTFOLIO_FILTERS: {
  id: "all" | PortfolioCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "app", label: "App" },
  { id: "chatbot", label: "Chatbot" },
  { id: "designs", label: "Designs" },
  { id: "mmd", label: "MMD" },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    slug: "york-yoga",
    title: "York Yoga Corner",
    category: "web",
    cover: yorkYoga,
    hasWalkthrough: true,
  },
  {
    slug: "essential",
    title: "Essential Air Solution",
    category: "web",
    cover: essential,
    hasWalkthrough: true,
  },
  {
    slug: "genesis",
    title: "iGenesis Myanmar",
    category: "web",
    cover: genesis,
    hasWalkthrough: true,
  },
  {
    slug: "myan-pro-solutions",
    title: "Property Management Solutions",
    category: "web",
    cover: myanProSolutions,
  },
  {
    slug: "myan-gate",
    title: "MyanGate",
    category: "web",
    cover: myanGate,
    hasWalkthrough: true,
  },
  {
    slug: "avs",
    title: "AVS",
    category: "web",
    cover: avs,
  },
  {
    slug: "hwt",
    title: "HWT",
    category: "web",
    cover: hwt,
  },
  {
    slug: "c2",
    title: "C2",
    category: "web",
    cover: c2,
  },
  {
    slug: "anime-mm-sub",
    title: "Anime MM Sub",
    category: "web",
    cover: animeMmSub,
  },
  {
    slug: "myan-bell",
    title: "MyanBell",
    category: "web",
    cover: myanBell,
  },
  {
    slug: "kmd",
    title: "KMD",
    category: "web",
    cover: kmd,
  },
  {
    slug: "hnd-project",
    title: "HND project",
    category: "web",
    cover: hndProject,
  },
  {
    slug: "ia-conqueror",
    title: "IA Conqueror",
    category: "app",
    cover: iaConqueror,
  },
  {
    slug: "chikanero",
    title: "Chikanero",
    category: "app",
    cover: chikanero,
  },
  {
    slug: "myan-bell-chatbot",
    title: "MyanBell Chatbot",
    category: "chatbot",
    cover: myanBellChatbot,
  },
  {
    slug: "final-prototype-day",
    title: "Final prototype — day",
    category: "designs",
    cover: finalPrototypeDay,
  },
  {
    slug: "final-prototype-night",
    title: "Final prototype — night",
    category: "designs",
    cover: finalPrototypeNight,
  },
  {
    slug: "wizard",
    title: "Wizard",
    category: "designs",
    cover: wizard,
  },
  {
    slug: "wizard-study",
    title: "Wizard study",
    category: "designs",
    cover: wizardStudy,
  },
  {
    slug: "potion",
    title: "Potion",
    category: "designs",
    cover: potion,
  },
  {
    slug: "cheese",
    title: "Cheese",
    category: "designs",
    cover: cheese,
  },
  {
    slug: "rubiks-cube",
    title: "Rubik's Cube",
    category: "designs",
    cover: rubiksCube,
  },
  {
    slug: "tsukasa-tsukuyomi",
    title: "Tsukasa Tsukuyomi",
    category: "mmd",
    cover: tsukasaTsukuyomi,
  },
  {
    slug: "sei-no-glasses",
    title: "Sei no glasses",
    category: "mmd",
    cover: seiNoGlasses,
  },
  {
    slug: "dungeon",
    title: "Dungeon",
    category: "mmd",
    cover: dungeon,
  },
  {
    slug: "black-wizard",
    title: "Black Wizard",
    category: "mmd",
    cover: blackWizard,
  },
  {
    slug: "zeus",
    title: "Zeus",
    category: "mmd",
    cover: zeus,
  },
  {
    slug: "zeus-attack",
    title: "Zeus attack",
    category: "mmd",
    cover: zeusAttack,
  },
  {
    slug: "slime",
    title: "Slime",
    category: "mmd",
    cover: slime,
  },
  {
    slug: "slime-attack",
    title: "Slime attack",
    category: "mmd",
    cover: slimeAttack,
  },
];

export function portfoliosForFilter(
  filter: "all" | PortfolioCategory,
): PortfolioItem[] {
  if (filter === "all") return PORTFOLIO_ITEMS;
  return PORTFOLIO_ITEMS.filter((item) => item.category === filter);
}
