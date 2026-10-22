import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/energy/dashboard';
export const Route = createFileRoute('/')({
  head: () => pageMetadata("/"),
  component: Dashboard,
});
