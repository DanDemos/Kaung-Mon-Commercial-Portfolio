import type { StaticImageData } from "next/image";
import alidac from "../../../assets/brand/clients/alidac.png";
import animeMmSub from "../../../assets/brand/clients/anime-mm-sub.png";
import avs from "../../../assets/brand/clients/avs.png";
import c2 from "../../../assets/brand/clients/c2.png";
import essentialAir from "../../../assets/brand/clients/essential-air.png";
import genesis from "../../../assets/brand/clients/genesis.png";
import hwt from "../../../assets/brand/clients/hwt.png";
import lozengeGalleria from "../../../assets/brand/clients/lozenge-galleria.png";
import mps from "../../../assets/brand/clients/mps.png";
import vnm from "../../../assets/brand/clients/vnm.png";
import yorkYoga from "../../../assets/brand/clients/york-yoga.png";

export type ClientLogo = {
  id: string;
  name: string;
  mark: StaticImageData;
};

/** All unique client marks under `assets/brand/clients/`. */
export const CLIENT_LOGOS: ClientLogo[] = [
  { id: "essential-air", name: "Essential Air Solution", mark: essentialAir },
  { id: "genesis", name: "Genesis", mark: genesis },
  { id: "york-yoga", name: "York Yoga", mark: yorkYoga },
  { id: "lozenge-galleria", name: "Lozenge Galleria", mark: lozengeGalleria },
  { id: "hwt", name: "HWT", mark: hwt },
  { id: "alidac", name: "Alidac Healthcare", mark: alidac },
  { id: "c2", name: "C2 Online Shopping Mall", mark: c2 },
  { id: "mps", name: "MPS", mark: mps },
  { id: "vnm", name: "Vocaloid Nation Myanmar", mark: vnm },
  { id: "avs", name: "Av's", mark: avs },
  { id: "anime-mm-sub", name: "Anime MM Sub", mark: animeMmSub },
];
