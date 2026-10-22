import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { CommunityPage } from '@/components/energy/community-page';
export const Route = createFileRoute('/community')({
  head: () => pageMetadata("/community"),
  component: CommunityPage,
});
