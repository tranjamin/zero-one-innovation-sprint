import { createFileRoute } from '@tanstack/react-router';
import { InfoPage } from '@/components/energy/info-page';
export const Route = createFileRoute('/info')({
  head: () => ({ meta: [
    { title: 'Help & Information | Wien Energie Smart Energy' },
    { name: 'description', content: 'Answers about smart appliance charging, energy communities and tariff benefits.' },
    { property: 'og:title', content: 'Help & Information | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Answers about smart appliance charging, energy communities and tariff benefits.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: InfoPage,
});
