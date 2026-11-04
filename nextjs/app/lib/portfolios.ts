/**
 * Works index for `/work`.
 * Shape mirrors the old `portfolio-container` items:
 * category filter class + title + kind label + optional external link.
 * Covers: `assets/portfolios/{slug}/cover.*`
 */

import type { StaticImageData } from "next/image";

import animeMmSub from "../../../assets/portfolios/anime-mm-sub/cover.jpg";
import avs from "../../../assets/portfolios/avs/cover.jpg";
import blackWizard from "../../../assets/portfolios/black-wizard/cover.gif";
import c2 from "../../../assets/portfolios/c2/cover.jpg";
import cheese from "../../../assets/portfolios/cheese/cover.jpg";
import chikanero from "../../../assets/portfolios/chikanero/cover.jpg";
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

/** Same filters as the old `#portfolio-flters` list. */
export type PortfolioCategory =
  | "web"
  | "app"
  | "chatbot"
  | "designs"
  | "mmd";

export type PortfolioItem = {
  slug: string;
  /** Visible title (h4 in old markup). */
  title: string;
  /** Filter bucket — old `filter-web` / `filter-app` / … */
  category: PortfolioCategory;
  /** Overlay line under the title — Website, App, Drawing, Animation, … */
  kind: string;
  cover: StaticImageData;
  /** Live external project link. Omit when the site is gone. */
  href?: string;
  /** Former URL kept for records when `href` is omitted. */
  archivedHref?: string;
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

/**
 * Order follows the old `portfolio-container` row.
 * Titles / kinds / hrefs taken from that markup.
 */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    slug: "york-yoga",
    title: "York Yoga Corner",
    category: "web",
    kind: "Website",
    cover: yorkYoga,
    archivedHref: "https://yorkyogacorner.com/",
    hasWalkthrough: true,
  },
  {
    slug: "essential",
    title: "Essential Air Solution",
    category: "web",
    kind: "Website",
    cover: essential,
    archivedHref: "https://essentialairsolution.com/",
    hasWalkthrough: true,
  },
  {
    slug: "genesis",
    title: "Genesis Myanmar",
    category: "web",
    kind: "Website",
    cover: genesis,
    archivedHref: "http://genesismyanmar.com/",
    hasWalkthrough: true,
  },
  {
    slug: "myan-gate",
    title: "MyanGate",
    category: "web",
    kind: "Website",
    cover: myanGate,
    href: "https://myangate.com/",
    hasWalkthrough: true,
  },
  {
    slug: "myan-bell",
    title: "Myanbell",
    category: "web",
    kind: "Website",
    cover: myanBell,
    href: "https://myanbell.com/",
  },
  {
    slug: "myan-pro-solutions",
    title: "Myan Pro Solutions",
    category: "web",
    kind: "Website",
    cover: myanProSolutions,
    href: "https://myanprosolutions.com/",
  },
  {
    slug: "hwt",
    title: "HWT Hardwares",
    category: "app",
    kind: "App",
    cover: hwt,
    href: "https://play.google.com/store/apps/details?id=com.myanshop.hwt",
  },
  {
    slug: "c2",
    title: "Cotton Concept",
    category: "app",
    kind: "App",
    cover: c2,
    href: "https://play.google.com/store/apps/details?id=com.myanshop.c2onlineshoppingmall",
  },
  {
    slug: "avs",
    title: "Av's Online Store",
    category: "app",
    kind: "App",
    cover: avs,
    href: "https://play.google.com/store/apps/details?id=com.myanshop.avsonlinestore",
  },
  {
    slug: "anime-mm-sub",
    title: "Anime MM Sub",
    category: "app",
    kind: "App",
    cover: animeMmSub,
    href: "https://play.google.com/store/apps/details?id=com.jp.ul.nwayoofansub",
  },
  {
    slug: "kmd",
    title: "KMD",
    category: "app",
    kind: "Student project (final year)",
    cover: kmd,
  },
  {
    slug: "myan-bell-chatbot",
    title: "Myanbell",
    category: "chatbot",
    kind: "Chatbot",
    cover: myanBellChatbot,
    href: "https://www.facebook.com/Myanbellofficial/",
  },
  {
    slug: "hnd-project",
    title: "Seventh April Online Shop",
    category: "web",
    kind: "Student project (HND)",
    cover: hndProject,
    href: "https://docs.google.com/document/d/1Ga7dvY4VtSAej1zeqmTaulGtjXxwedsq/edit?usp=sharing&ouid=103913041693913816097&rtpof=true&sd=true",
  },
  {
    slug: "tsukasa-tsukuyomi",
    title: "Tsukasa Tsukuyomi",
    category: "designs",
    kind: "Drawing",
    cover: tsukasaTsukuyomi,
  },
  {
    slug: "sei-no-glasses",
    title: "Sei Takanashi",
    category: "designs",
    kind: "Drawing",
    cover: seiNoGlasses,
  },
  {
    slug: "slime-attack",
    title: "Slime",
    category: "designs",
    kind: "Animation",
    cover: slimeAttack,
  },
  {
    slug: "slime",
    title: "Slime walk",
    category: "designs",
    kind: "Animation",
    cover: slime,
  },
  {
    slug: "zeus-attack",
    title: "Zeus",
    category: "designs",
    kind: "Animation",
    cover: zeusAttack,
  },
  {
    slug: "zeus",
    title: "Zeus idle",
    category: "designs",
    kind: "Animation",
    cover: zeus,
  },
  {
    slug: "black-wizard",
    title: "Black Wizard",
    category: "designs",
    kind: "Animation",
    cover: blackWizard,
  },
  {
    slug: "wizard",
    title: "Wizard",
    category: "designs",
    kind: "Drawing",
    cover: wizard,
  },
  {
    slug: "wizard-study",
    title: "Wizard study",
    category: "designs",
    kind: "Drawing",
    cover: wizardStudy,
  },
  {
    slug: "potion",
    title: "Lava Potion",
    category: "designs",
    kind: "Drawing",
    cover: potion,
  },
  {
    slug: "rubiks-cube",
    title: "Rubik's Cube",
    category: "designs",
    kind: "Drawing",
    cover: rubiksCube,
  },
  {
    slug: "final-prototype-night",
    title: "Smart Car UI",
    category: "designs",
    kind: "Student project design",
    cover: finalPrototypeNight,
  },
  {
    slug: "final-prototype-day",
    title: "Smart Car UI — day",
    category: "designs",
    kind: "Student project design",
    cover: finalPrototypeDay,
  },
  {
    slug: "chikanero",
    title: "Chika Dance Nero Claudius",
    category: "mmd",
    kind: "MMD",
    cover: chikanero,
    href: "https://youtu.be/lnps2LOVhkE",
  },
  {
    slug: "ia-conqueror",
    title: "IA — Conqueror",
    category: "mmd",
    kind: "MMD",
    cover: iaConqueror,
    href: "https://youtu.be/rtrv5rbjF54",
  },
];

export function portfoliosForFilter(
  filter: "all" | PortfolioCategory,
): PortfolioItem[] {
  if (filter === "all") return PORTFOLIO_ITEMS;
  return PORTFOLIO_ITEMS.filter((item) => item.category === filter);
}
