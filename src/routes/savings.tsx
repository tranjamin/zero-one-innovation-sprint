import { createFileRoute } from '@tanstack/react-router';
import { SavingsPage } from '@/components/energy/savings-page';
export const Route = createFileRoute('/savings')({
  head: () => ({ meta: [
    { title: 'Savings & Credits | Wien Energie Smart Energy' },
    { name: 'description', content: 'Track optimised energy savings and redeemable monthly energy credits.' },
    { property: 'og:title', content: 'Savings & Credits | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Track optimised energy savings and redeemable monthly energy credits.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: SavingsPage,
});
