import type { Locale } from "./locale";
import { PATH_CONTENT_MY } from "./path-content-my";
import {
  DEFAULT_CONTENT,
  DEFAULT_PATH,
  PATH_CONTENT,
  type PathContent,
  type VisitorPath,
} from "./visitor-paths";

export function contentFor(
  path: VisitorPath = DEFAULT_PATH,
  locale: Locale = "en",
): PathContent {
  if (locale === "my") {
    return PATH_CONTENT_MY[path] ?? PATH_CONTENT[path] ?? DEFAULT_CONTENT;
  }
  return PATH_CONTENT[path] ?? DEFAULT_CONTENT;
}
