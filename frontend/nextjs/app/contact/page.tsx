import type { Metadata } from "next";
import ContactExperience from "../components/contact-experience";

export const metadata: Metadata = {
  title: "Contact — Kaung Mon",
  description: "Send Kaung Mon a message about a project, role, or question.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
