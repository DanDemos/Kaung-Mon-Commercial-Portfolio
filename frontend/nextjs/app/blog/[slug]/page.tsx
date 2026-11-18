import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogExperience from "../../components/blog-experience";
import { BLOG_POSTS, blogById } from "../../lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogById(slug);
  if (!post) {
    return { title: "Post not found — Kaung Mon" };
  }
  return {
    title: `${post.title} — Kaung Mon`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogById(slug);
  if (!post) notFound();

  return <BlogExperience postId={slug} />;
}
