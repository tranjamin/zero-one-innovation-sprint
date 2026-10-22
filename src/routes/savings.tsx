import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { SavingsPage } from '@/components/energy/savings-page';
export const Route = createFileRoute('/savings')({
  head: () => pageMetadata("/savings"),
  component: SavingsPage,
});
