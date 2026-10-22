import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/energy/dashboard';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Overview | Wien Energie Smart Energy' },
    { name: 'description', content: 'Your Wien Energie home energy overview, optimised charging plans and local solar forecasts.' },
    { property: 'og:title', content: 'Overview | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Your Wien Energie home energy overview, optimised charging plans and local solar forecasts.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Dashboard,
});
