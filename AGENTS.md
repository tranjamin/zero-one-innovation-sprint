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

- Use a shared energy-app shell and React context for the interactive frontend prototype; sample data is explicitly illustrative and resets on reload, with no live appliance or tariff integrations.
- Keep charging calculations in a browser-safe domain module with concrete rule tests; each named app view has its own TanStack route and metadata.
- Use the shared language context and message catalog for all UI text and locale formatting; keep tariff/type identifiers and customer-entered names language-neutral so switching never changes household data.
- Carry illustrative energy-source forecasts into selected slots and group schedules through the shared chargingWindows function, preserving gaps and source changes consistently across cards, tables and dialogs.
