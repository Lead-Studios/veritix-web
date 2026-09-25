import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <Container className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        That page does not exist, or it may have moved.
      </p>
      <Button asChild>
        <Link href={routes.home}>Back to home</Link>
      </Button>
    </Container>
  );
}



