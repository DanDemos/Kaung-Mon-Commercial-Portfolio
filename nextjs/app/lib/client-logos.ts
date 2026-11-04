import type { StaticImageData } from "next/image";
import alidac from "../../../assets/brand/clients/alidac.png";
import animeMmSub from "../../../assets/brand/clients/anime-mm-sub.png";
import avs from "../../../assets/brand/clients/avs.png";
import c2 from "../../../assets/brand/clients/c2.png";
import essentialAir from "../../../assets/brand/clients/essential-air.png";
import genesis from "../../../assets/brand/clients/genesis.png";
import hwt from "../../../assets/brand/clients/hwt.png";
import jdonut from "../../../assets/brand/clients/jdonut.png";
import lozengeGalleria from "../../../assets/brand/clients/lozenge-galleria.png";
import mps from "../../../assets/brand/clients/mps.png";
import vnm from "../../../assets/brand/clients/vnm.png";
import yorkYoga from "../../../assets/brand/clients/york-yoga.png";

export type ClientLogo = {
  id: string;
  name: string;
  mark: StaticImageData;
  /** Client site / social — opens in a new tab. */
  href?: string;
};

/** All unique client marks under `assets/brand/clients/`. */
export const CLIENT_LOGOS: ClientLogo[] = [
  {
    id: "essential-air",
    name: "Essential Air Solution",
    mark: essentialAir,
    href: "https://essentialairsolution.com/",
  },
  {
    id: "genesis",
    name: "Genesis",
    mark: genesis,
    href: "http://genesismyanmar.com/",
  },
  {
    id: "york-yoga",
    name: "York Yoga",
    mark: yorkYoga,
    href: "https://yorkyogacorner.com/",
  },
  {
    id: "lozenge-galleria",
    name: "Lozenge Galleria",
    mark: lozengeGalleria,
    href: "https://www.facebook.com/lozengegalleria/",
  },
  {
    id: "hwt",
    name: "HWT",
    mark: hwt,
    href: "https://www.facebook.com/Hardwaretoolmyanmar/",
  },
  {
    id: "alidac",
    name: "Alidac Healthcare",
    mark: alidac,
    href: "https://www.mpmdma.org/alidac-healthcare-zydus/",
  },
  {
    id: "c2",
    name: "C2 Online Shopping Mall",
    mark: c2,
    href: "https://www.facebook.com/CottonConcept-906257929418438/",
  },
  { id: "jdonut", name: "J'Donuts", mark: jdonut },
  {
    id: "mps",
    name: "MPS",
    mark: mps,
    href: "https://myanprosolutions.com/",
  },
  {
    id: "vnm",
    name: "Vocaloid Nation Myanmar",
    mark: vnm,
    href: "http://vocaloidnationmm.com.pl/",
  },
  {
    id: "avs",
    name: "Av's",
    mark: avs,
    href: "https://avsstoreonline.com/",
  },
  {
    id: "anime-mm-sub",
    name: "Anime MM Sub",
    mark: animeMmSub,
    href: "https://www.animemmsub.com/",
  },
];
