<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use the shared energy-app shell and LiveEnergyProvider for read-only external demo data; never provision a new backend, mutate the supplied dataset or invoke its engine from the app, because this integration only authorises SELECT.
- Keep charging calculations in a browser-safe domain module with concrete rule tests; each named app view has its own TanStack route and metadata.
- Use the shared language context and message catalog for all UI text and locale formatting; keep tariff/type identifiers and customer-entered names language-neutral so switching never changes household data.
- Use root URL search for shared scenario selection and ensureQueryData/useSuspenseQuery for household/scenario reads, so navigation and refresh preserve selection and query caching.
- Display external device run_windows unchanged and group quarter-hour timeline recommendations with timelineWindows, preserving gaps and source changes without recalculating supplied plans.
- Store only the device-local onboarding opt-out in localStorage after hydration; it is a browser preference, not household data.
- Distinguish intended community allocation policy from imported model outputs; read-only results cannot establish equal allocation or guaranteed community pricing.
- Keep restored appliance edits/new devices as explicitly unsaved session drafts until an authenticated household-scoped write contract is supplied; never mutate plan views or claim imported schedules have been recalculated.
