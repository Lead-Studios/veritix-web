import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument, LegalList, type LegalSection } from '@/components/legal-document';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What personal data Veritix collects, why, who it is shared with, how long it is ' +
    'kept, and the rights you have over it.',
};

/**
 * A starting draft, written to describe what the system actually does rather than
 * what a policy template says. It has not been through legal review and must be
 * before launch — the controller identity, the supervisory authority, the
 * transfer mechanism, and the statutory retention periods are all knowable only
 * from outside this repository, and the values below are marked as placeholders
 * wherever that is true.
 *
 * `LAST_UPDATED` is the only date to bump when the copy changes.
 */
const LAST_UPDATED = '2026-09-25';

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who this policy covers',
    body: (
      <>
        <p>
          This policy covers the Veritix website and the Veritix ticketing service, including
          the pages in this application, the buyer and organizer accounts on them, and the
          APIs that serve them.
        </p>
        <p>
          Veritix is the controller for the personal data described here. Where an event
          organizer collects your data — for instance, when you use a wallet you also use on
          an unrelated site — the organizer is the controller for that collection and
          publishes their own policy.
        </p>
        <p>
          This policy does not cover the Stellar network, the wallets you connect, or other
          networks and services we link to. Those are separate controllers with their own
          terms and privacy practices.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: (
      <>
        <p>We collect the following. It is worth reading the fourth entry closely.</p>
        <LegalList
          items={[
            {
              term: 'Account data',
              detail:
                'Your email address, your display name, and the password hash for your account. If you sign in with a wallet, we still ask for an email address so we can reach you about your tickets and your settlements.',
            },
            {
              term: 'Wallet addresses and transaction records',
              detail:
                'The Stellar addresses you connect, the transactions we submit on your behalf, and the resulting public transaction identifiers. These are also recorded on the Stellar network, where anyone can read them, permanently, whatever this policy says about deletion.',
            },
            {
              term: 'Ticket and event records',
              detail:
                'What you bought, from whom, at what price, in what tier, and every refund, transfer, and settlement transaction those tickets were involved in. We keep this because it is what proves a ticket is genuine and what resolves a dispute later.',
            },
            {
              term: 'Organizer data',
              detail:
                'Identity and payout details required to pay you, plus the revenue shares you define and the addresses each share is released to.',
            },
            {
              term: 'Usage and device data',
              detail:
                'Pages viewed, actions taken, approximate location derived from your IP address, browser and device type, and timestamps. This is used to find faults and to see which parts of the product are used.',
            },
            {
              term: 'Communications',
              detail:
                'Messages you send us, and the messages we send you about an event, a settlement, a refund, or an account. Ticket confirmations and settlement notices are transactional records and are kept with your ticket records; marketing email is not.',
            },
            {
              term: 'Newsletter subscriptions',
              detail:
                'The address you gave us and the fact that you subscribed. Nothing else — the newsletter is a list of addresses, not an account.',
            },
          ]}
        />
      </>
    ),
  },
  {
    id: 'on-chain-data',
    heading: 'What cannot be deleted',
    body: (
      <>
        <p>
          Veritix settles on a public blockchain. A transfer we submit is recorded on the
          Stellar network and is visible to anyone who looks for it, permanently, including
          after you delete your account and after we delete our records of it.
        </p>
        <p>
          We do not put personal data on-chain. The addresses, amounts, and transaction
          identifiers are, and they are public by the nature of the network. What we can do
          is stop holding the off-chain records that connect an address to an email address
          and a name — and we will, on request, subject to the retention periods below.
        </p>
        <p>
          This is a real limit, not a disclaimer, and it applies to your wallet address and to
          any wallet you connect. Please do not connect a wallet whose public history would
          identify you in a way you have not accepted.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-use-it',
    heading: 'Why we use it',
    body: (
      <LegalList
        items={[
          {
            term: 'To operate the service',
            detail:
              'To create accounts, hold escrow, verify tickets at the door, and make settlement transfers. This is the processing necessary to deliver what you signed up for.',
          },
          {
            term: 'To pay you and to pay refunds',
            detail:
              'Payout and refund data is used to move money to the right address, and to keep the records that show a payout happened.',
          },
          {
            term: 'To resolve disputes',
            detail:
              'Ticket and transfer history is used to answer a claim about a ticket, a transfer, or a settlement. Without it we could not tell a genuine buyer from a duplicate.',
          },
          {
            term: 'To keep the service secure and available',
            detail:
              'Usage and device data is used to detect fraud and abuse, to rate-limit requests, and to find faults before they are reported.',
          },
          {
            term: 'To send service messages',
            detail:
              'Transactional email about your tickets, refunds, and settlements. This is not marketing and there is no way to opt out of it without losing the ticket.',
          },
          {
            term: 'To send the newsletter, if you asked for it',
            detail:
              'The newsletter is sent because you subscribed. Every message has a one-click unsubscribe, and unsubscribing does not affect any other communication.',
          },
          {
            term: 'To send marketing email',
            detail:
              'Only where you have given consent that has not been withdrawn, and never to an address you bought a ticket with unless you have separately asked for it.',
          },
          {
            term: 'To meet legal obligations',
            detail:
              'Tax, accounting, and anti-fraud record-keeping, and responding to competent authorities where we are required to.',
          },
        ]}
      />
    ),
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    body: (
      <>
        <p>
          We do not sell personal data, and we do not share it for anyone else's advertising.
          We share it with the following, only for the purposes set out here:
        </p>
        <ul>
          <li>
            <strong>Subprocessors.</strong> Infrastructure, error monitoring, email delivery,
            and payment providers who host or transmit data on our instruction. Each is bound
            by contract to the same protections and may not use the data for its own purposes.
          </li>
          <li>
            <strong>The organizer you bought from.</strong> They receive what they need to
            admit you, run the event, and settle it — which normally includes your name, your
            email address, and the tickets. They are an independent controller for that data.
          </li>
          <li>
            <strong>The Stellar network.</strong> Every transfer, by design, as described in
            the section above.
          </li>
          <li>
            <strong>Authorities.</strong> Where we are legally required to, or where we
            reasonably believe there is an active risk of harm that requires disclosure.
          </li>
          <li>
            <strong>A successor.</strong> If Veritix is sold or merges, your data goes with it,
            and we will tell you before it does.
          </li>
        </ul>
        <p>
          We do not share ticket buyer details with other organizers. If another organizer
          publishes a similar event, they see their own sales, not who bought yours.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: (
      <>
        <p>
          We keep data for as long as it is needed for the purpose it was collected, and then
          no longer. In practice:
        </p>
        <LegalList
          items={[
            {
              term: 'Account data',
              detail:
                'Until you delete your account, then for 30 days, after which it is removed from our active systems.',
            },
            {
              term: 'Ticket, transfer, and settlement records',
              detail:
                'For the period required by tax and accounting law where you live, which is commonly 7 to 10 years. These are the records that prove a ticket was genuine and that a payout was made, so we cannot shorten them without losing the ability to settle a dispute.',
            },
            {
              term: 'Payout and tax records',
              detail:
                'For the statutory retention period in the jurisdiction of the paying entity. The periods below are placeholders pending legal review.',
            },
            {
              term: 'Newsletter subscriptions',
              detail:
                'Until you unsubscribe, and for 30 days afterwards, so we can honour a re-subscribe or a deletion request.',
            },
            {
              term: 'Usage and device data',
              detail:
                'Up to 14 months in aggregate form, and up to 90 days in a form that could identify you.',
            },
            {
              term: 'Server logs',
              detail: 'Up to 90 days.',
            },
            {
              term: 'Security and fraud records',
              detail:
                'For as long as needed to establish what happened, which is typically 24 months from the incident.',
            },
          ]}
        />
        <p>
          When a period ends, the data is deleted or anonymized. Anonymized data is no longer
          personal data and is kept only in aggregate.
        </p>
      </>
    ),
  },
  {
    id: 'transfers',
    heading: 'Where your data is processed',
    body: (
      <>
        <p>
          We and our subprocessors process data in the countries where we and they operate,
          which may not be where you live. Where personal data leaves the European Economic
          Area or the United Kingdom, we rely on an adequacy decision or on standard
          contractual clauses, and we assess the transfer risk before relying on either.
        </p>
        <p>
          The specific mechanism and the list of processing countries are maintained with our
          subprocessor register and are available on request.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>
          Depending on where you live you may have the right to:
        </p>
        <LegalList
          items={[
            {
              term: 'Access',
              detail:
                'Get a copy of the personal data we hold about you, including the ticket, transfer, and settlement records we keep.',
            },
            {
              term: 'Correct it',
              detail:
                'Fix anything inaccurate. The caveat is that a settled transaction record is what it is; if it is wrong as a record of what happened on-chain, we correct our copy and tell you, rather than rewriting history.',
            },
            {
              term: 'Delete it',
              detail:
                'Have your account data deleted. This does not delete settled transaction records, which we must keep, nor anything already written to the Stellar network.',
            },
            {
              term: 'Get a portable copy',
              detail:
                'Receive your data in a structured, machine-readable format. The event and ticket export already does this.',
            },
            {
              term: 'Object or restrict',
              detail:
                'Object to processing based on legitimate interests, or ask us to pause processing while a dispute is resolved.',
            },
            {
              term: 'Withdraw consent',
              detail:
                'Where we rely on consent — marketing email, and the newsletter — withdraw it at any time without affecting anything processed before you did.',
            },
            {
              term: 'Complain',
              detail:
                'To your local data protection authority. We would rather you told us first, but that is your choice and it does not affect your rights with them.',
            },
          ]}
        />
        <p>
          To make a request, use the <Link href={routes.contact}>contact page</Link> and say
          which right you are exercising. We answer within 30 days, and usually much sooner. We
          do not charge for a request, and we will not treat you differently for making one.
        </p>
        <p>
          We may ask you to confirm a request is really yours before we act on it. If we
          cannot verify a request, we will say so rather than guess.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and local storage',
    body: (
      <>
        <LegalList
          items={[
            {
              term: 'Strictly necessary',
              detail:
                'The session cookie that keeps you signed in, and your colour theme choice. Without these the service does not work, so they are set without consent and cannot be switched off.',
            },
            {
              term: 'Analytics',
              detail:
                'Aggregate page and interaction counts, used to see which parts of the product are used and where it breaks. Set only after you accept them.',
            },
          ]}
        />
        <p>
          Analytics cookies are not set until you accept them, and clearing the choice in the
          cookie banner withdraws that consent. We do not use advertising cookies and we do not
          run cross-site tracking pixels in transactional email.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    heading: 'How we protect it',
    body: (
      <>
        <p>
          We encrypt data in transit and at rest, restrict access by role, keep an audit log
          of who read what, and run the service over TLS only. Session cookies are
          `HttpOnly`, `SameSite`, and `Secure`, and are scoped to the site rather than to a
          path.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your personal data, we will notify
          you and the relevant authority within the time the law requires, and tell you what
          we know and what we are doing — not wait until we have a complete picture.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    heading: 'Children',
    body: (
      <p>
        Veritix is not for children. We do not knowingly collect data from anyone under 16, or
        below the age of digital consent where it is higher. If you believe a child has given
        us data, tell us through the <Link href={routes.contact}>contact page</Link> and we
        will delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <p>
        We update this policy when what we do changes, and the date at the top always shows the
        current version. A material change is announced by email to registered accounts 30
        days before it takes effect. Continuing to use the service after that means you accept
        the new version.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Privacy questions and requests',
    body: (
      <p>
        Privacy questions, access requests, and deletions all go through the{' '}
        <Link href={routes.contact}>contact page</Link>. Mark the message for the privacy
        team so it reaches the right people first time. If you are unhappy with our response,
        you can complain to your local data protection authority.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary="What we collect, what we cannot delete, and how to get it back or have it removed."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
