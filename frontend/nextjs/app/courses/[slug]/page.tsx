import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoursesExperience from "../../components/courses-experience";
import { COURSES, courseById } from "../../lib/courses";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.id }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = courseById(slug);
  if (!course) {
    return { title: "Course not found — Kaung Mon" };
  }
  return {
    title: `${course.title} — Kaung Mon`,
    description: course.blurb,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = courseById(slug);
  if (!course) notFound();

  return <CoursesExperience courseId={slug} />;
}
