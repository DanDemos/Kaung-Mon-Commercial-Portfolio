import type { StaticImageData } from "next/image";
import keinPyiSiPhoto from "../../../assets/people/voices/kein-pyi-si.jpg";
import khinPhoto from "../../../assets/people/voices/khin.jpg";
import waiYanPhoto from "../../../assets/people/voices/wai-yan.jpg";
import type { PathVoiceId } from "./visitor-paths";

/** Voice portraits (high-quality JPEG). Imported only by Voices UI. */
export const VOICE_PHOTOS = {
  kein: keinPyiSiPhoto,
  khin: khinPhoto,
  "wai-yan": waiYanPhoto,
} as const satisfies Record<PathVoiceId, StaticImageData>;
