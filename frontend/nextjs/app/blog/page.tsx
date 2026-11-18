import type { Metadata } from "next";
import BlogExperience from "../components/blog-experience";

export const metadata: Metadata = {
  title: "Blog — Kaung Mon",
  description:
    "Notes on React, UI, and building — starting with React 19.2 Activity.",
};

export default function BlogPage() {
  return <BlogExperience />;
}
