import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/energy/settings-page';
export const Route = createFileRoute('/settings')({
  head: () => ({ meta: [
    { title: 'Settings | Wien Energie Smart Energy' },
    { name: 'description', content: 'Manage your household preferences, tariff and community energy optimisation.' },
    { property: 'og:title', content: 'Settings | Wien Energie Smart Energy' },
    { property: 'og:description', content: 'Manage your household preferences, tariff and community energy optimisation.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: SettingsPage,
});
