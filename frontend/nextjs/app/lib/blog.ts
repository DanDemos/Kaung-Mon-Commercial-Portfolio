import type { StaticImageData } from "next/image";
import beforeActivity from "../../assets/blog/1764015577739.jpg";
import afterActivity from "../../assets/blog/1764015577855.jpg";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | {
      type: "image";
      src: StaticImageData;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  | { type: "hr" };

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  /** ISO date for sorting / metadata */
  date: string;
  /** Display date */
  dateLabel: string;
  tags: string[];
  /** Card / OG preview — first figure in the post */
  cover: StaticImageData;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
  body: BlogBlock[];
};

/**
 * Frontend-only blog posts. Add new entries here (and images under
 * `assets/blog/`) — no API required.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "react-19-2-activity",
    title: "React 19.2 Activity: a cleaner way to show and hide UI",
    excerpt:
      "Conditional render resets state. Conditional CSS leaks memory. React 19.2’s <Activity /> keeps state and runs cleanup — and when you should still avoid it.",
    date: "2025-10-08",
    dateLabel: "Oct 8, 2025",
    tags: ["React", "19.2", "Activity"],
    cover: beforeActivity,
    coverAlt:
      "Side-by-side React snippets: conditional rendering versus display none",
    coverWidth: 1280,
    coverHeight: 488,
    body: [
      {
        type: "p",
        text: "React 19.2 introduced a new way to show and hide components, closing a gap that used to force a tradeoff between state and cleanup.",
      },
      {
        type: "p",
        text: "Before the React 19.2 update on October 1, 2025, we had two common options to show or hide a component: conditional rendering, or conditional CSS.",
      },
      {
        type: "image",
        src: beforeActivity,
        alt: "Before React 19.2 Activity — conditional rendering vs conditional CSS",
        width: 1280,
        height: 488,
        caption: "The two pre-Activity patterns side by side.",
      },
      {
        type: "h2",
        text: "The issue with conditional rendering",
      },
      {
        type: "p",
        text: "When the condition is false, React unmounts the component and drops everything inside it. Remount later, and every piece of state resets to its defaults.",
      },
      {
        type: "p",
        text: "That behaviour is completely fine when reset is what you want.",
      },
      {
        type: "h2",
        text: "The issue with conditional CSS",
      },
      {
        type: "p",
        text: "When you need to keep state inside the hidden tree, conditional CSS keeps the component in the DOM and only hides it visually. Because it never unmounts, state, refs, and effects keep working.",
      },
      {
        type: "p",
        text: "The cost: cleanup from useEffect return never runs while the tree is “hidden.” Event listeners, subscriptions, and other side effects can keep living even though the user cannot see that UI — a quiet path to memory leaks.",
      },
      {
        type: "p",
        text: "So both options had a real drawback.",
      },
      {
        type: "h2",
        text: "Enter React’s Activity",
      },
      {
        type: "p",
        text: "React introduced <Activity /> for this middle ground. It takes one prop, mode, which as of React 19.2 is either \"visible\" or \"hidden\".",
      },
      {
        type: "image",
        src: afterActivity,
        alt: "After React 19.2 Activity — wrapping a child with mode visible or hidden",
        width: 1280,
        height: 631,
        caption: "Same toggle intent, with Activity driving visibility.",
      },
      {
        type: "p",
        text: "Activity behaves like conditional CSS for show and hide: the tree can keep its state. It also runs cleanup effects from children when you hide them — fixing the leak path of pure CSS hiding — with a cleaner API.",
      },
      {
        type: "p",
        text: "Even so, I do not recommend wrapping every conditional in Activity.",
      },
      {
        type: "h2",
        text: "When you should avoid Activity",
      },
      {
        type: "ol",
        items: [
          "Static condition — nothing the user does can flip the UI. Example: a “Delete account” control that only appears when permission comes from the server. Prefer conditional rendering.",
          "You do not need to keep state — if reset-on-hide is fine (or better), conditional rendering stays the right tool. You also avoid babysitting effect cleanup for a tree that should simply go away.",
        ],
      },
    ],
  },
];

export function blogById(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}
