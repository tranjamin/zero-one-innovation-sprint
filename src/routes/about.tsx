import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/energy/about-page';
export const Route = createFileRoute('/about')({
  head: () => ({ meta: [
    { title: 'About Smart Energy | Wien Energie Smart Energy' },
    { name: 'description', content: 'How smart appliance charging works — the data it reads, the rules it keeps, and how variable, fixed and community customers benefit.' },
    { property: 'og:title', content: 'About Smart Energy | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'How smart appliance charging works — the data it reads, the rules it keeps, and how clients benefit.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: AboutPage,
});
