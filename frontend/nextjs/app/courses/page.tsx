import type { Metadata } from "next";
import CoursesExperience from "../components/courses-experience";

export const metadata: Metadata = {
  title: "Courses — Kaung Mon",
  description:
    "Choose a curriculum — HTML, CSS, JavaScript, or React — then open lessons at your pace.",
};

export default function CoursesPage() {
  return <CoursesExperience />;
}
