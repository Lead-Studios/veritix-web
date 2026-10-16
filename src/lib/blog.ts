import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/**
 * Blog content, read from `src/content/blog` at build time.
 *
 * Posts are MDX files in the repository rather than rows in a database. The
 * argument for that is specific to a marketing blog: posts are reviewed like
 * code, they have an author and a review history, they get reverted like code,
 * and the deploy pipeline is the only thing that can put one live. A CMS would
 * add a database, an auth layer, a preview environment, and a class of "the
 * marketing site is down" incident — in exchange for letting a non-engineer
 * publish, which is a real trade but not one this repository has made.
 *
 * Files are read on the server only. `node:fs` at module scope would break any
 * client import, which is the point: nothing that renders a post should be
 * able to.
 */

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

/** Post extensions `MDXRemote` can compile. */
const POST_EXTENSIONS = ['.mdx', '.md'] as const;

/**
 * Frontmatter, as validated.
 *
 * Validated rather than cast. A blog post with no `publishedAt` should fail the
 * build with the file name in the message, not render with
 * `Invalid Date` in the byline or silently sort to the bottom of the index.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(300),
  /** ISO `YYYY-MM-DD`. Date-only, deliberately: a post has no time of day. */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'publishedAt must be YYYY-MM-DD'),
  author: z.string().min(1).max(80).default('Veritix'),
  tags: z.array(z.string().min(1).max(30)).default([]),
  /** Gives the post a wider slot at the top of the index. At most one should. */
  featured: z.boolean().default(false),
  /** Kept out of the index and returns 404 unless `BLOG_INCLUDE_DRAFTS=1`. */
  draft: z.boolean().default(false),
});

export type BlogFrontmatter = z.infer<typeof frontmatterSchema>;

/** Everything a card, a byline, or `generateStaticParams` needs. */
export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  /** Minutes, never below 1. */
  readingMinutes: number;
  /** Word count of the prose, after markdown is stripped. */
  words: number;
}

export interface BlogPostWithContent extends BlogPost {
  /** The MDX body, frontmatter removed. */
  content: string;
}

/**
 * Include drafts.
 *
 * Off by default. A draft in the index is a post someone will find in a search
 * result and share from a staging deploy, and the set of people who can flip
 * this is the set of people who run a preview build.
 */
const includeDrafts = process.env.BLOG_INCLUDE_DRAFTS === '1';

/**
 * Module-level cache.
 *
 * `generateStaticParams` and the page render both ask for the list, and without
 * this the directory is walked and every file parsed twice per build. Cleared by
 * nothing at runtime — posts are immutable within a deployment by design, since
 * they come from the repository rather than from a request.
 */
let cache: { posts: BlogPost[]; contents: Map<string, string> } | null = null;

function readAll(): { posts: BlogPost[]; contents: Map<string, string> } {
  if (cache) return cache;

  const contents = new Map<string, string>();
  const posts: BlogPost[] = [];

  let filenames: string[];
  try {
    filenames = fs.readdirSync(CONTENT_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `No blog content directory at ${CONTENT_DIR}. Create it and add at least one post, ` +
          'or remove the blog routes.',
      );
    }
    throw error;
  }

  for (const filename of filenames.sort()) {
    if (!POST_EXTENSIONS.some((extension) => filename.endsWith(extension))) continue;

    const slug = filename.slice(0, filename.length - path.extname(filename).length);
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
    const { data, content } = parseFrontmatter(raw, filename);

    contents.set(slug, content);

    const { words } = measure(content);
    posts.push({
      slug,
      frontmatter: data,
      readingMinutes: readingMinutes(words),
      words,
    });
  }

  // Newest first. Slug is the tiebreaker so two posts dated the same day — which
  // happens when a series goes out — do not swap places between builds.
  posts.sort((a, b) => {
    const byDate = b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt);
    return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
  });

  cache = { posts, contents };
  return cache;
}

/** Published posts, newest first. */
export function listPosts(): BlogPost[] {
  const posts = readAll().posts;
  return includeDrafts ? posts : posts.filter((post) => !post.frontmatter.draft);
}

/**
 * One post and its MDX body, or `null` when the slug is unknown or is a draft.
 *
 * Returning `null` rather than throwing is deliberate: this is what
 * `notFound()` and a 404 from `generateStaticParams` both need, and a draft
 * should be indistinguishable from a post that does not exist.
 */
export function getPost(slug: string): BlogPostWithContent | null {
  const { posts, contents } = readAll();
  const post = posts.find((candidate) => candidate.slug === slug);
  if (!post) return null;
  if (post.frontmatter.draft && !includeDrafts) return null;

  const content = contents.get(slug);
  if (content === undefined) return null;

  return { ...post, content };
}

/** Slugs for `generateStaticParams`. */
export function listPostSlugs(): string[] {
  return listPosts().map((post) => post.slug);
}

/** Reading time in whole minutes, never below 1. */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const WORDS_PER_MINUTE = 220;

/**
 * Word count of the prose.
 *
 * An estimate, and the comment on the constant says so. The number is a promise
 * to the reader about how long this will take; being wrong by a few words is
 * fine, being wrong by a factor of two because link targets were counted as
 * words is not, which is why the markdown is stripped first.
 */
export function measure(content: string): { words: number; minutes: number } {
  const words = stripMarkdown(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return { words, minutes: readingMinutes(words) };
}

/** Remove the syntax a reader does not read out loud. */
function stripMarkdown(content: string): string {
  return content
    // Fenced code first, so nothing inside it is mistaken for inline syntax.
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    // Images before links: `![alt](src)` contains `[alt](src)`.
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Reference-style links leave the definition behind.
    .replace(/^\[[^\]]+\]:\s*\S+.*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[#>\-*+]+\s*/gm, '')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/^[=-]{3,}\s*$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split `---` frontmatter from the body.
 *
 * Hand-written rather than pulled from `gray-matter` for two reasons. First,
 * `next-mdx-remote` already depends on it transitively, so there is nothing to
 * gain in bundle size — the reason to hand-roll is the second one. Second, a
 * permissive YAML parser on a directory of files that are in the repository
 * means a typo like a tab in the indentation is either silently accepted or
 * fails with a message about line 4 of an unnamed string. This throws with the
 * filename, the line number, and the line itself, and it only understands the
 * handful of shapes these posts are allowed to use.
 *
 * Supported: `key: value` where value is a single- or double-quoted string, a
 * bare string, a boolean, a number, a `YYYY-MM-DD` date, or a `[a, b]` list.
 * Anything else throws.
 */
export function parseFrontmatter(
  raw: string,
  filename = 'post',
): { data: BlogFrontmatter; content: string } {
  // A leading BOM would make the first line `﻿---` and fail the check below.
  const text = raw.replace(/^﻿/, '');

  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text);
  if (!match) {
    throw new Error(
      `${filename}: no frontmatter block. A post must start with a line containing only ` +
        '"---", then its fields, then another "---" line.',
    );
  }

  const fields: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 2; // 1-based, and the file starts with `---`.
    const trimmed = line.trim();

    // Blank lines and whole-line comments. Not an inline `#`, which would break
    // any value containing one — a URL fragment, for instance.
    if (!trimmed || trimmed.startsWith('#')) return;

    const separator = trimmed.indexOf(':');
    if (separator === -1) {
      throw new Error(
        `${filename}:${lineNumber}: expected "key: value", got ${JSON.stringify(trimmed)}.`,
      );
    }

    const key = trimmed.slice(0, separator).trim();
    if (!key) {
      throw new Error(`${filename}:${lineNumber}: empty field name.`);
    }

    fields[key] = parseValue(trimmed.slice(separator + 1).trim(), filename, lineNumber);
  });

  const parsed = frontmatterSchema.safeParse(fields);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(frontmatter)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`${filename}: invalid frontmatter:\n${issues}`);
  }

  return { data: parsed.data, content: text.slice(match[0].length) };
}

function parseValue(value: string, filename: string, lineNumber: number): unknown {
  if (!value) return '';

  if (
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2) ||
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2)
  ) {
    // The quote is the only escape supported, so a value containing the other
    // quote character needs no escaping at all. Using the wrong one is a build
    // error rather than a silently mangled string.
    return value.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((item) => parseValue(item.trim(), filename, lineNumber));
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  // A bare token that looks like a date stays a string; `zod` validates the
  // shape, and `new Date('2026-02-30')` being a real date is not this file's
  // problem to solve.
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);

  return value;
}
