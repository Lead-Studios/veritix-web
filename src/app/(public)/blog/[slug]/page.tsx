import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | VeriTix Blog`,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.slice(0, 160),
      images: [post.coverImage],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b1025] text-white">
      <header className="border-b border-white/10 bg-[#0a0f24]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-wide text-white"
            aria-label="VeriTix home"
          >
            VeriTix
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/events" className="transition hover:text-white">
              Explore
            </Link>
            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-white/80 transition hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-2 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-[#4d21ff]/20 px-3 py-1 text-xs font-medium text-[#7c85ff]"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl text-white sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readingTime} min read</span>
              </div>
              <button
                className="flex items-center gap-2 text-white/60 transition hover:text-white"
                aria-label="Share this post"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </header>

          <div className="mb-8 overflow-hidden rounded-3xl">
            <Image
              src={post.coverImage || "/concert.png"}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full object-cover"
              priority
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </article>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="font-display text-2xl text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/70 mb-6">
            Join thousands of users who are already experiencing the future of event ticketing with VeriTix.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Create Account
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-[#2f3378] px-8 py-3 text-sm font-semibold text-[#7c85ff] transition hover:text-white"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
