import type { Metadata } from "next";
import ResumeExperience from "../components/resume-experience";

export const metadata: Metadata = {
  title: "Resume — Kaung Mon",
  description: "Education and experience for hiring teams.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResumePage() {
  return <ResumeExperience />;
}
