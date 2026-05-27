import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, StatDisplay } from '../components/dashboard/Card'
import { StatusBadge, EventStatus } from '../components/dashboard/StatusBadge'

// ─── Card ────────────────────────────────────────────────────────────────────

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello</Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies extra className', () => {
    const { container } = render(<Card className="rounded-lg">content</Card>)
    expect(container.firstChild).toHaveClass('rounded-lg')
  })
})

describe('CardHeader', () => {
  it('renders title', () => {
    render(<CardHeader title="Revenue" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('renders optional subtitle when provided', () => {
    render(<CardHeader title="Revenue" subtitle="This week" />)
    expect(screen.getByText('This week')).toBeInTheDocument()
  })

  it('does not render subtitle when omitted', () => {
    render(<CardHeader title="Revenue" />)
    expect(screen.queryByText('This week')).not.toBeInTheDocument()
  })

  it('renders optional extraInfo when provided', () => {
    render(<CardHeader title="Revenue" extraInfo="Weekly Summary" />)
    expect(screen.getByText('Weekly Summary')).toBeInTheDocument()
  })
})

describe('StatDisplay', () => {
  it('renders label, value and detail', () => {
    render(<StatDisplay label="Payouts" value="₦ 50,000" detail="Next: 3 days" />)
    expect(screen.getByText('Payouts')).toBeInTheDocument()
    expect(screen.getByText('₦ 50,000')).toBeInTheDocument()
    expect(screen.getByText('Next: 3 days')).toBeInTheDocument()
  })
})

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const VARIANTS: { status: EventStatus; label: string }[] = [
  { status: 'active',    label: 'Active' },
  { status: 'draft',     label: 'Draft' },
  { status: 'ended',     label: 'Ended' },
  { status: 'cancelled', label: 'Cancelled' },
]

describe('StatusBadge', () => {
  it.each(VARIANTS)('renders $status variant with correct text', ({ status, label }) => {
    render(<StatusBadge status={status} text={label} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it.each(VARIANTS)('has accessible aria-label for $status', ({ status, label }) => {
    render(<StatusBadge status={status} text={label} />)
    expect(screen.getByLabelText(`Status: ${label}`)).toBeInTheDocument()
  })

  it('defaults to active styling when no status prop given', () => {
    render(<StatusBadge text="Active" />)
    expect(screen.getByLabelText('Status: Active')).toBeInTheDocument()
  })

  it('snapshot — active', () => {
    const { container } = render(<StatusBadge status="active" text="Active" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('snapshot — draft', () => {
    const { container } = render(<StatusBadge status="draft" text="Draft" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('snapshot — ended', () => {
    const { container } = render(<StatusBadge status="ended" text="Ended" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('snapshot — cancelled', () => {
    const { container } = render(<StatusBadge status="cancelled" text="Cancelled" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
