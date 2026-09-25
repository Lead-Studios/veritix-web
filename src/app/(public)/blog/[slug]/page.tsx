import type { Metadata } from 'next';
import type { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { Separator } from '@/components/ui/separator';
import { getPost, listPostSlugs } from '@/lib/blog';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';

/**
 * A single blog post.
 *
 * Statically generated. `generateStaticParams` returns the slugs that exist at
 * build time, so a post is a file in the repository or it is nothing, and adding
 * one is a deploy rather than a database write.
 *
 * `dynamicParams` is left at its default of `true`, so a post committed after
 * this build still renders on first request and is then cached. That is
 * deliberate: a deploy that silently 404s a post someone just published is
 * worse than one that compiles a route it did not know about.
 */

interface PostParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    // A missing post gets a real 404 with a real title, rather than the index
    // page's metadata attached to a not-found body.
    return { title: 'Post not found' };
  }

  const { title, description, author, publishedAt } = post.frontmatter;

  return {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: publishedAt,
      authors: [author],
    },
  };
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug } = await params;
  const post = getPost(slug);

  // A draft and a post that does not exist are deliberately indistinguishable
  // here, so publishing one by accident does not turn a preview deploy into a
  // public copy of the draft.
  if (!post) notFound();

  const { title, description, author, publishedAt, tags } = post.frontmatter;

  return (
    <>
      <article>
        <header className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="max-w-3xl">
              <Link
                href={routes.blog}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                All posts
              </Link>

              {/* The title is the only h1 on the page. Everything inside the MDX
                  body starts at h2, which is the convention the posts follow —
                  worth stating here, because a post that starts at h1 puts two
                  h1s on the page and breaks the outline. */}
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>

              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-foreground">{author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </p>
            </div>
          </Container>
        </header>

        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="mdx-body">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {tags.length > 0 && (
              <>
                <Separator className="my-12" />
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="outline">{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}

/**
 * MDX element overrides.
 *
 * Only anchors are overridden. Two reasons, both about the output being correct
 * rather than about how it was written:
 *
 * - An external link opened in a new tab without `rel="noopener"` hands the
 *   opened page a reference to `window.opener`. Every MDX author would have to
 *   remember that, and the ones who forget are indistinguishable in review.
 * - Internal links rendered as plain anchors cause a full page reload. A
 *   blog post linking to `/pricing` should navigate the way the rest of the
 *   site navigates.
 *
 * `img` is deliberately not overridden. A markdown image carries no width or
 * height, which `next/image` needs; supplying it means either fixed dimensions
 * that lie about the image, or a layout shift on every post. Optimising post
 * images properly means a remark plugin that reads the dimensions off the file,
 * which is worth doing and is not part of this issue. Until then these render
 * unoptimised, and the cost of that is the post's own size.
 */
const mdxComponents = {
  a: MdxAnchor,
};

function MdxAnchor({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const target = href ?? '';
  const external = /^https?:\/\//i.test(target);

  if (external) {
    return (
      <a href={target} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
        {/* "external link" is visually hidden and spoken, so the fact that this
            leaves the site is available to a screen reader user and invisible to
            everyone else. It is not in the link text a sighted reader sees,
            which is deliberate: "(external link)" repeated through a post is
            noise for the person who did not ask. */}
        <span className="sr-only"> (external link)</span>
      </a>
    );
  }

  return (
    <Link href={target} {...props}>
      {children}
    </Link>
  );
}
