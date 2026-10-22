import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/energy/about-page';
export const Route = createFileRoute('/about')({
  head: () => pageMetadata("/about"),
  component: AboutPage,
});
