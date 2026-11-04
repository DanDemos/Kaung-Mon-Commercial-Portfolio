import type { Metadata } from "next";
import WorkExperience from "../components/work-experience";

export const metadata: Metadata = {
  title: "Work — Kaung Mon",
  description: "Projects Kaung Mon has worked on — web, apps, chatbot, designs, and motion.",
};

export default function WorkPage() {
  return <WorkExperience />;
}
