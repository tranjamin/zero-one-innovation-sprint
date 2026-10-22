import { createFileRoute } from '@tanstack/react-router';
import { CommunityPage } from '@/components/energy/community-page';
export const Route = createFileRoute('/community')({
  head: () => ({ meta: [
    { title: 'Energy Community | Wien Energie Smart Energy' },
    { name: 'description', content: 'Explore neighbourhood solar surplus and your Vienna energy community.' },
    { property: 'og:title', content: 'Energy Community | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Explore neighbourhood solar surplus and your Vienna energy community.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: CommunityPage,
});
