import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { listPosts, type BlogPost } from '@/lib/blog';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on escrow, settlement, and verifiable ticketing: how the money moves, ' +
    'what the ledger actually proves, and why the network underneath it is Stellar.',
};

/**
 * The index.
 *
 * Rendered at build time. Nothing here reads request state, so the whole page
 * is static and the reading time shown on each card is the reading time of the
 * post as committed — not of a post someone edited without rebuilding.
 *
 * At most one post should set `featured: true`. If more than one does, the first
 * in date order is used and the rest appear in the grid below, so a second
 * featured post is a layout oddity rather than a build failure.
 */
export default function BlogIndexPage() {
  const posts = listPosts();
  const featured = posts.find((post) => post.frontmatter.featured) ?? null;
  const rest = posts.filter((post) => post !== featured);

  return (
    <>
      <section className="border-b border-border">
        <Container className="flex flex-col items-start gap-4 py-16 sm:py-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            How the money moves, what the ledger does and does not prove, and the reasoning
            behind the parts of this product that are unusual.
          </p>
        </Container>
      </section>

      {featured && (
        <section aria-labelledby="featured-heading" className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <h2 id="featured-heading" className="text-sm font-semibold tracking-tight">
              Featured
            </h2>
            <Card className="mt-6">
              <CardHeader>
                <PostMeta post={featured} />
                <CardTitle className="text-2xl sm:text-3xl">
                  <Link
                    href={routes.blogPost(featured.slug)}
                    className="hover:underline underline-offset-4"
                  >
                    {featured.frontmatter.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {featured.frontmatter.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostTags post={featured} />
                <Link
                  href={routes.blogPost(featured.slug)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                >
                  Read the post
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </Container>
        </section>
      )}

      <section aria-labelledby="all-posts-heading">
        <Container className="py-16 sm:py-20">
          <h2 id="all-posts-heading" className="text-2xl font-semibold tracking-tight">
            {featured ? 'All posts' : 'Posts'}
          </h2>

          {rest.length === 0 ? (
            <p className="mt-6 text-muted-foreground">No posts yet. Check back soon.</p>
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post.slug} className="flex">
                  <Card className="flex w-full flex-col">
                    <CardHeader>
                      <PostMeta post={post} />
                      {/* The title is the link, not the whole card. A card-sized
                          link contains other text a screen reader reads as one
                          long run, and a whole-card link is a 200px hit target
                          around a heading that already names the post. */}
                      <CardTitle>
                        <Link
                          href={routes.blogPost(post.slug)}
                          className="hover:underline underline-offset-4"
                        >
                          {post.frontmatter.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-6">
                      <CardDescription>{post.frontmatter.description}</CardDescription>
                      <PostTags post={post} />
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

/**
 * Date and reading time.
 *
 * The date is inside a `<time>` with a machine-readable `dateTime`, so a feed
 * reader or a search index gets a date rather than "14 Aug 2026". The reading
 * time is prose, not a decorative label, and it is never hidden from assistive
 * technology — a reader deciding whether to start a nine-minute post is
 * entitled to know.
 */
function PostMeta({ post }: { post: BlogPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      <time dateTime={post.frontmatter.publishedAt}>
        {formatDate(post.frontmatter.publishedAt)}
      </time>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden="true" />
        {post.readingMinutes} min read
      </span>
      {post.frontmatter.featured && <span className="sr-only">Featured post</span>}
    </p>
  );
}

function PostTags({ post }: { post: BlogPost }) {
  if (post.frontmatter.tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {post.frontmatter.tags.map((tag) => (
        <li key={tag}>
          <Badge variant="outline">{tag}</Badge>
        </li>
      ))}
    </ul>
  );
}
