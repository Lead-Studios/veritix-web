import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { Calendar, Clock, User, Tag } from "lucide-react";

export default function BlogPage() {
  const posts = getAllPosts();

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
            <Link href="/blog" className="flex flex-col text-white">
              Blog
              <span className="mt-2 block h-[2px] w-8 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff]" />
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

      <main className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Latest news, updates, and insights about VeriTix and Stellar
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-white/60">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(10,16,40,0.5)] backdrop-blur transition hover:border-[#4d21ff]/50">
        <div className="overflow-hidden rounded-2xl bg-[#141b3b]">
          <Image
            src={post.coverImage || "/concert.png"}
            alt={post.title}
            width={420}
            height={260}
            className="h-48 w-full object-cover transition group-hover:scale-105"
          />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap gap-2">
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

          <h2 className="font-display text-xl text-white group-hover:text-[#7c85ff] transition">
            {post.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
