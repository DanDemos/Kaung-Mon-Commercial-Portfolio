"use client";

import { useId, useMemo } from "react";
import { CLIENT_LOGOS } from "../lib/client-logos";
import MediaImage from "./media-image";
import "./client-stage.css";

type ClientStageProps = {
  title: string;
};

/**
 * Worked-with marks — continuous logo rail (pauses on logo hover).
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
          {loop.map((client, index) => {
            const isClone = index >= CLIENT_LOGOS.length;
            const mark = (
              <MediaImage
                src={client.mark}
                alt={isClone ? "" : client.name}
                width={184}
                height={184}
                sizes="(max-width: 640px) 76px, 92px"
                contain
                className="km-client-stage__mark"
              />
            );

            return (
              <li
                key={`${client.id}-${index}`}
                className="km-client-stage__item"
                aria-hidden={isClone}
              >
                {client.href ? (
                  <a
                    className="km-client-stage__link"
                    href={client.href}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={isClone ? -1 : undefined}
                    aria-label={isClone ? undefined : `${client.name} (opens in a new tab)`}
                  >
                    {mark}
                  </a>
                ) : (
                  mark
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
