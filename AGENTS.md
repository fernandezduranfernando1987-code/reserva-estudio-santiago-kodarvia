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

- Keep admin storage adaptation in `src/lib/admin-reservas.ts`; preserve original record fields and write to the selected source key so legacy bookings remain compatible.
- Read browser storage only after hydration; admin uses the first populated local source, including the main booking key, because this project has no connected backend.
- Preserve explicitly saved empty booking arrays so deleting the final reservation does not restore sample data.
- Share blocked-hour persistence and overlap checks through `src/lib/horas-bloqueadas.ts`; recheck saved blocks before creating or moving a booking to prevent stale forms bypassing restrictions.
- Keep studio information and manual blocking in reusable components, with administration only on the `/admin` route.
