import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '@/components/energy/info-page';
export const Route = createFileRoute('/info')({
  head: () => pageMetadata("/info"),
  component: InfoPage,
});
