import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface LegalSection {
  /** Stable fragment id, also the anchor the table of contents links to. */
  id: string;
  heading: string;
  /** Paragraphs, lists, and tables. Rendered inside the readable measure. */
  body: React.ReactNode;
}

export interface LegalDocumentProps {
  title: string;
  /** One-sentence summary, shown under the title and reused in the meta tag. */
  summary: string;
  /** ISO `YYYY-MM-DD`. Kept next to the content so a copy edit has one place to bump. */
  lastUpdated: string;
  sections: readonly LegalSection[];
  className?: string;
}

/**
 * Shared shell for the Terms and Privacy pages.
 *
 * Three things every long-form legal page needs and neither of these documents
 * should re-implement:
 *
 * 1. A table of contents. Both documents are longer than one screen, and on a
 *    phone the only way to reach section 14 is to scroll past everything before
 *    it. The links are real anchors rather than a scroll handler, so they work
 *    with the browser's find-in-page, history, and middle-click.
 * 2. A readable measure. The site's own `Container` is a marketing measure, up
 *    to seven columns wide; body text at that width has a line length no one
 *    can track. Sections are capped separately and the table of contents sits
 *    beside them, not inside them.
 * 3. A last-updated date, in a `<time>` element with a machine-readable
 *    `dateTime`, so it is not a claim in prose that can quietly go stale.
 */
export function LegalDocument({
  title,
  summary,
  lastUpdated,
  sections,
  className,
}: LegalDocumentProps) {
  const updated = formatDate(lastUpdated);
  const contentsId = 'contents';

  return (
    <div className={cn('py-16 sm:py-20', className)}>
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{summary}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            Last updated:{' '}
            <time dateTime={lastUpdated}>{updated}</time>
          </p>
        </div>

        <div className="mt-12 gap-12 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          {/*
            Sticky on a wide screen, where it sits beside the text as a running
            index. On a narrow one it stacks above the content and scrolls away,
            which is the only sensible behaviour on a phone.
          */}
          <nav
            aria-labelledby={contentsId}
            className="mb-10 lg:mb-0 lg:sticky lg:top-24 lg:self-start"
          >
            <h2 id={contentsId} className="text-sm font-semibold tracking-tight">
              Contents
            </h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <span className="tabular-nums">{index + 1}.</span> {section.heading}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                // Anchor links land slightly under the sticky site header, which
                // would otherwise cover the heading they just navigated to.
                className="mb-12 scroll-mt-24"
              >
                {/* Heading numbers are carried visually but the accessible name
                    must match the contents list it links from, so the number is
                    aria-hidden and the list item text stays identical. */}
                <h2
                  id={`${section.id}-heading`}
                  className="text-2xl font-semibold tracking-tight"
                >
                  <span aria-hidden="true" className="text-muted-foreground">
                    {index + 1}.
                  </span>{' '}
                  {section.heading}
                </h2>
                <div className="legal-body mt-4 max-w-prose text-muted-foreground">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

/** A definition-style list of terms, used for fees, retention, and rights. */
export function LegalList({
  items,
}: {
  items: readonly { term: string; detail: string }[];
}) {
  return (
    <dl className="space-y-4">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="font-medium text-foreground">{item.term}</dt>
          <dd className="mt-1">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
