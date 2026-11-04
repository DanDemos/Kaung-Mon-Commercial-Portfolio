"use client";

import { useId, useMemo } from "react";
import { CLIENT_LOGOS } from "../lib/client-logos";
import MediaImage from "./media-image";
import "./client-stage.css";

type ClientStageProps = {
  title: string;
};

/**
 * Worked-with marks — continuous logo rail (pauses on hover).
 * Duplicates the list so the marquee loops without a jump.
 */
export default function ClientStage({ title }: ClientStageProps) {
  const labelId = useId();
  const loop = useMemo(() => [...CLIENT_LOGOS, ...CLIENT_LOGOS], []);

  if (CLIENT_LOGOS.length === 0) return null;

  return (
    <div
      className="km-client-stage"
      role="region"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
    >
      <p id={labelId} className="sr-only">
        {title}
      </p>

      <div className="km-client-stage__viewport">
        <ul className="km-client-stage__track" aria-label={title}>
          {loop.map((client, index) => (
            <li
              key={`${client.id}-${index}`}
              className="km-client-stage__item"
              aria-hidden={index >= CLIENT_LOGOS.length}
            >
              <MediaImage
                src={client.mark}
                alt={index < CLIENT_LOGOS.length ? client.name : ""}
                width={368}
                height={152}
                sizes="(max-width: 640px) 304px, 368px"
                contain
                className="km-client-stage__mark"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
