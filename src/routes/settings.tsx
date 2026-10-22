import { pageMetadata } from '@/lib/page-metadata';
import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/energy/settings-page';
export const Route = createFileRoute('/settings')({
  head: () => pageMetadata("/settings"),
  component: SettingsPage,
});
