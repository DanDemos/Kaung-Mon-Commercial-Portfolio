import type { Metadata } from "next";
import WorkExperience from "../components/work-experience";

export const metadata: Metadata = {
  title: "Work — Kaung Mon",
  description: "Projects Kaung Mon has worked on — web, app, chatbot, designs, and MMD.",
};

export default function WorkPage() {
  return <WorkExperience />;
}
