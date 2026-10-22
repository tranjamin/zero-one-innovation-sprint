import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { AppliancesPage } from '@/components/energy/appliances-page';
export const Route = createFileRoute('/appliances')({
  head: () => pageMetadata("/appliances"),
  component: AppliancesPage,
});
