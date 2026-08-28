import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeoHeatmap from '@/components/dashboard/GeoHeatmap';

const sampleRegions = [
  { label: 'Nigeria', count: 500, percentage: 45 },
  { label: 'Ghana', count: 200, percentage: 18 },
  { label: 'Kenya', count: 150, percentage: 13.5 },
];

describe('GeoHeatmap (#794)', () => {
  it('renders the geographic distribution heading', () => {
    render(<GeoHeatmap regions={sampleRegions} />);
    expect(screen.getByText('Geographic Distribution')).toBeInTheDocument();
  });

  it('renders map and table toggle buttons', () => {
    render(<GeoHeatmap regions={sampleRegions} />);
    expect(screen.getByRole('button', { name: /Map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Table/i })).toBeInTheDocument();
  });

  it('shows table view when toggled', () => {
    render(<GeoHeatmap regions={sampleRegions} />);

    const tableButton = screen.getByRole('button', { name: /Table/i });
    tableButton.click();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Nigeria')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('has accessible aria-label on map', () => {
    render(<GeoHeatmap regions={sampleRegions} />);
    expect(
      screen.getByRole('img', { name: /World choropleth map of attendee distribution/ }),
    ).toBeInTheDocument();
  });

  it('has accessible table fallback', () => {
    render(<GeoHeatmap regions={sampleRegions} />);

    const tableButton = screen.getByRole('button', { name: /Table/i });
    tableButton.click();

    expect(
      screen.getByRole('table', { name: /Attendee geographic distribution/ }),
    ).toBeInTheDocument();
  });

  it('shows colour legend in map view', () => {
    render(<GeoHeatmap regions={sampleRegions} />);
    expect(screen.getByText('Low → High attendance')).toBeInTheDocument();
  });
});
