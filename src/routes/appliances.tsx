import { createFileRoute } from '@tanstack/react-router';
import { AppliancesPage } from '@/components/energy/appliances-page';
export const Route = createFileRoute('/appliances')({
  head: () => ({ meta: [
    { title: 'Appliances | Wien Energie Smart Energy' },
    { name: 'description', content: 'Manage connected appliances, charging targets, deadlines and provisional energy schedules.' },
    { property: 'og:title', content: 'Appliances | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Manage connected appliances, charging targets, deadlines and provisional energy schedules.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: AppliancesPage,
});
