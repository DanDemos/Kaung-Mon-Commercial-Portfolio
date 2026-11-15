/** Shared contract — every loader variant must accept this. */
export type SiteLoaderProps = {
  /** Theme/prefs resolved — dissolve the gate. */
  ready: boolean;
};
