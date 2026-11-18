import { render, screen } from '@testing-library/react';
import { Pagination } from '@/components/ui/pagination';

const hrefForPage = (p: number) => `/x?page=${p}`;

describe('Pagination', () => {
  it('marks current page with aria-current', () => {
    render(<Pagination page={1} totalPages={2} hrefForPage={hrefForPage} />);
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const current = screen.getByRole('link', { name: 'Page 1, current page' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Go to page 2' })).toHaveAttribute('href', '/x?page=2');
  });

  it('shows disabled states for previous/next', () => {
    render(<Pagination page={1} totalPages={2} hrefForPage={hrefForPage} />);

    expect(screen.getByText('Previous page, unavailable')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '/x?page=2');
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" isDisabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" isDisabled />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
  });
});
