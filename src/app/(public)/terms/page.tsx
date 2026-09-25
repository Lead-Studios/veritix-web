import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument, type LegalSection } from '@/components/legal-document';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern the use of Veritix: escrow, settlement, fees, refunds, ' +
    'and the responsibilities of organizers and buyers.',
};

/**
 * A starting draft, written to describe how the product actually behaves rather
 * than to be maximally favourable to either side. It has not been through legal
 * review and must be before launch — in particular the jurisdiction, the entity
 * name, the liability caps, and the governing law, none of which are knowable
 * from inside this repository.
 *
 * `LAST_UPDATED` is the only date to bump when the copy changes. The renderer
 * formats it, so there is no second place to forget.
 */
const LAST_UPDATED = '2026-09-25';

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'acceptance',
    heading: 'Acceptance of these terms',
    body: (
      <>
        <p>
          These terms are a legal agreement between you and Veritix. They apply to every
          account, ticket, and event on the service, and to anyone who buys a ticket from
          an organizer publishing on Veritix.
        </p>
        <p>
          By creating an account, publishing an event, or buying a ticket you accept these
          terms. If you do not accept them, do not use the service. If you are agreeing on
          behalf of an organization, you confirm you have the authority to bind it.
        </p>
        <p>
          We may update these terms. Material changes are announced by email to registered
          organizers at least 30 days before they take effect, and the date at the top of
          this page always shows the current version. Continuing to publish or buy after a
          change takes effect means you accept the new version.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    heading: 'Who can use Veritix',
    body: (
      <>
        <p>
          You must be at least 18 years old, or the age of majority where you live, to
          create an organizer account. Anyone can buy a ticket, subject to the same
          minimum age where local law applies to the event rather than to the purchase.
        </p>
        <p>
          You may not use the service if doing so would breach the law where you are, if
          you are acting on behalf of a sanctioned party, or if a competent authority has
          asked us to stop you doing so. We may decline or terminate an account where we
          cannot establish these things are not the case.
        </p>
      </>
    ),
  },
  {
    id: 'what-veritix-is',
    heading: 'What Veritix is, and what it is not',
    body: (
      <>
        <p>
          Veritix is a ticketing platform. Ticket payments for an event are held in an
          on-chain escrow account, and are released to the shares you defined when the event
          settles. The escrow rules, the release shares, and the resulting transfers are all
          recorded on the Stellar network and are publicly verifiable by anyone, including
          us.
        </p>
        <p>
          This has consequences worth stating plainly. Settlement is a transfer on a public
          network, and a transfer that has been submitted cannot be recalled by us, by you,
          or by anyone else. We can pause an event and we can stop a release that has not yet
          been submitted, but we cannot reverse one that has.
        </p>
        <p>
          We are not a bank, a payment institution, or a party to your contract with the
          organizer. Ticket sales are a contract between you and the organizer. We provide
          the escrow, the ledger, and the settlement; the organizer is responsible for the
          event, the description of what you are buying, and the refund commitment published
          with the ticket.
        </p>
        <p>
          Stellar accounts, wallets, and the Stellar network are operated by parties other
          than us. Their availability, their fees, and their own terms are outside our
          control, and using Veritix means using them.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    heading: 'Accounts',
    body: (
      <>
        <p>
          You are responsible for what happens under your account, including keeping any
          connected wallet key material out of reach of others. We cannot recover a wallet
          whose key you have lost, and nobody — including us — can reset it for you.
        </p>
        <p>
          Tell us promptly if you believe your account or a connected wallet has been
          compromised. We can suspend publishing and settlement while we establish what
          happened. We cannot reverse transfers that have already been submitted to the
          network.
        </p>
        <p>
          One person or organization may hold one account. Additional organizer entities
          should be separate accounts with their own wallets, because settlement is per
          account and a shared wallet makes the ledger ambiguous.
        </p>
      </>
    ),
  },
  {
    id: 'organizer-obligations',
    heading: 'What organizers agree to',
    body: (
      <>
        <p>
          As an organizer you confirm that for every event you publish:
        </p>
        <ul>
          <li>
            you have the right to sell tickets for it, including any rights you need from
            performers, venues, or rights holders;
          </li>
          <li>
            the description, date, location, capacity, and refund commitment are accurate
            and will remain so;
          </li>
          <li>
            you will honour every ticket you have sold, including if you cancel, whether or
            not anyone asks you to;
          </li>
          <li>
            the revenue shares you define are the real ones, and anyone with a share has
            agreed to it;
          </li>
          <li>
            you will not publish an event whose primary purpose is to move funds in a way
            that misleads buyers.
          </li>
        </ul>
        <p>
          Capacity is a promise to buyers, not a setting. Publishing a smaller number of
          tickets than your venue can hold, or selling past a hard cap you published, is a
          breach of this agreement and may make you liable to the buyers affected.
        </p>
      </>
    ),
  },
  {
    id: 'buyer-obligations',
    heading: 'What buyers agree to',
    body: (
      <>
        <p>
          A ticket is a right of admission to an event, not a transferable financial
          instrument. You may transfer a ticket only where the organizer has enabled
          transfers, and only through the transfer flow on the service. Transfers made
          outside it are not recorded in the ledger and will not be honoured at the door or
          at settlement.
        </p>
        <p>
          Do not attempt to verify, resell, or present a ticket you did not buy or receive
          through a transfer. A ticket that fails verification is cancelled without refund,
          because it cannot be distinguished from a forgery.
        </p>
      </>
    ),
  },
  {
    id: 'fees',
    heading: 'Fees and payment',
    body: (
      <>
        <p>
          The fee for each ticket is the rate shown on the{' '}
          <Link href={routes.pricing}>pricing page</Link> at the moment the event was
          published, applied as a percentage plus a fixed per-ticket amount. Each event is
          priced with the rate that was live when it was published: changing your plan
          never reprices a sale that has already happened.
        </p>
        <p>
          Network fees for the escrow and settlement transactions are drawn from the fixed
          per-ticket amount. They are never added to the price a buyer pays, so a buyer
          never sees a charge they did not expect.
        </p>
        <p>
          Organizers are invoiced for the fee when a ticket is sold. Where an event sells no
          tickets, no fee is due.
        </p>
      </>
    ),
  },
  {
    id: 'refunds',
    heading: 'Refunds and cancellations',
    body: (
      <>
        <p>
          While an event's escrow account is open, the organizer may refund any ticket, and
          each refund is made from the escrow account to the original payment method. If an
          organizer cancels an event, every ticket sold is refundable from escrow, whether or
          not individual buyers ask.
        </p>
        <p>
          After settlement, a refund is not a reversal of the original ticket sale. It is a
          new transfer out of the organizer's settled share, recorded in the organizer's
          report as a refund rather than as a reduction in ticket revenue. We do not hold
          funds after settlement to make post-settlement refunds possible, and we could not
          do so if we wanted to — the release is unconditional once its conditions are met.
        </p>
        <p>
          An organizer who cancels an event repeatedly, or who fails to honour tickets, may
          be removed from the platform, and the events affected may be made visible to
          buyers who hold a ticket to them.
        </p>
      </>
    ),
  },
  {
    id: 'settlement',
    heading: 'Settlement and revenue splits',
    body: (
      <>
        <p>
          When an event's settlement window closes, the escrow account releases the shares
          defined when the event was published, in a single transaction, to the addresses
          registered against each share. Splits are defined before the first ticket is sold
          and cannot be edited once escrow has funds in it, because changing a split after
          buyers have paid would be changing the deal they accepted.
        </p>
        <p>
          We deduct our fee before the release. If the fee cannot be deducted — because the
          escrow holds less than the fee, for instance — the release is held and we contact
          the organizer rather than short-changing a share.
        </p>
        <p>
          Settlement records, the shares, and the resulting transfers are part of the public
          record. Your settlement history and the event export are yours to keep.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    body: (
      <>
        <p>You may not use Veritix to:</p>
        <ul>
          <li>
            publish or sell a ticket for anything unlawful, or that promotes unlawful conduct;
          </li>
          <li>
            misrepresent who is behind an event, or publish a capacity you know you cannot
            honour;
          </li>
          <li>
            interfere with the service, probe it without authorization, or use it to attack
            another person;
          </li>
          <li>
            scrape ticket records or buyer details, whether through the API, the interface,
            or by any other means;
          </li>
          <li>
            attempt to redeem a ticket more than once, or to redeem a ticket you know to have
            already been used;
          </li>
          <li>
            use the service in a way that violates a network operator's terms or a venue's
            terms.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'suspension',
    heading: 'Suspension and termination',
    body: (
      <>
        <p>
          We may suspend an account or an event where we reasonably believe these terms have
          been breached, that buyers are at risk, or that we are required to act by law or
          by a competent authority. Where a buyer is at risk, we act first and explain
          afterwards.
        </p>
        <p>
          We will tell you why, and give you an opportunity to respond, except where doing so
          would defeat the purpose or be unlawful. Ending an account does not end an
          obligation that has already accrued: an event already published stays published
          and its tickets stay honoured.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    body: (
      <>
        <p>
          Veritix — the software, the design system, the name, and the logo — is ours. You keep
          everything you bring to it: event names, descriptions, imagery, and your ticket
          sales records.
        </p>
        <p>
          You grant us a licence to host what you publish, to display it to buyers, and to
          show it in our own listings and search results. That licence ends when you delete
          the event, except for records we must keep for tax, dispute, or legal reasons.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers',
    body: (
      <>
        <p>
          The service is provided as it is. To the extent the law allows, we disclaim
          implied warranties of merchantability, fitness for a particular purpose, and
          non-infringement, and we make no warranty that the service will be uninterrupted,
          error-free, or that a submitted transfer will be included in any particular
          Stellar ledger close.
        </p>
        <p>
          Nothing in these terms excludes a warranty, a right, or a remedy that cannot be
          excluded by law. If a term here reads as excluding something that cannot legally be
          excluded, that term does not apply to you and the rest of it does.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <>
        <p>
          Neither party is liable for indirect or consequential loss, or for loss of profit,
          revenue, or goodwill, arising from these terms or the service.
        </p>
        <p>
          Each party's total liability under these terms is limited to the total fees paid to
          Veritix for the event that gave rise to the claim, or USD 1,000 where no fees were
          paid. Nothing limits liability for death or personal injury caused by negligence,
          for fraud or fraudulent misrepresentation, or for anything else that cannot be
          limited by law.
        </p>
        <p>
          The cap is not a limit on the organizer. A buyer's claim against an organizer for a
          cancelled event, a misdescribed event, or a ticket that was not honoured is a claim
          against that organizer, under that organizer's refund commitment, not against us.
        </p>
      </>
    ),
  },
  {
    id: 'indemnity',
    heading: 'Indemnification',
    body: (
      <>
        <p>
          Organizers agree to indemnify us against claims arising from an event they
          published: in particular, claims that publishing it infringed a third party's
          rights, that its description or refund commitment was misleading, or that it
          failed to honour tickets sold.
        </p>
        <p>
          We agree to indemnify organizers and buyers against claims arising from our own
          software, our breach of these terms, or our violation of law.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to the service',
    body: (
      <>
        <p>
          We may add, change, or remove features. We may change how settlement works where a
          change is required by a network operator or by law. We do not change how funds
          already escrowed for a published event are released, and we will not reduce a
          refund commitment already published for an event.
        </p>
        <p>
          Where a change would materially disadvantage an event that is already published, we
          will tell the organizer before it takes effect and let them cancel under the normal
          refund terms.
        </p>
      </>
    ),
  },
  {
    id: 'general',
    heading: 'General',
    body: (
      <>
        <p>
          These terms are governed by the laws of the jurisdiction in which the Veritix entity
          contracting with you is established, and disputes are subject to the exclusive
          jurisdiction of the courts of that jurisdiction. Nothing here removes any mandatory
          consumer protection you have where you live.
        </p>
        <p>
          If a provision is found unenforceable, the rest stands. We may assign these terms
          to a successor of the business; you may not assign them without our written
          consent. Failing to enforce a provision is not a waiver of it.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <>
        <p>
          Questions about these terms, including a request for a copy of your data or a
          record of what happened to an event, go through the{' '}
          <Link href={routes.contact}>contact page</Link>. Include the event reference and
          we will pick it up there rather than making you start again by email.
        </p>
        <p>
          Organizer disputes about a settlement go to the same place, marked for the
          settlements team, so they reach the people with the ledger rather than a general
          queue.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      summary="What Veritix does, what it does not do, and what you and we each agree to."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
