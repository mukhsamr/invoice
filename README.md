# Invoice Studio

Minimal professional invoice generator built with `SvelteKit`, `Tailwind CSS v4`, and `Cloudflare Workers + D1`.

## Features

- Owner setup and sign-in flow
- Business profile and invoice defaults
- Customer CRUD with archive flow
- Reusable service catalog
- Invoice CRUD, duplicate flow, and payment statuses
- Print-friendly invoice page for PDF export
- Dashboard with revenue and outstanding summaries
- Critical-flow Playwright E2E coverage

## Local development

```bash
rtk bun install
rtk bun run gen
rtk bun run dev
```

Open `/auth/setup` on first run to create the owner account.

## Demo seed

With the local preview/dev server running, seed optional demo data after owner setup:

```bash
rtk bun run seed:demo
```

## Validation

```bash
rtk bun run check
rtk bun run test:unit -- --run
rtk bun run test:e2e
rtk bun run build
```

## Cloudflare setup

1. Create a D1 database.
2. Replace `replace-with-your-d1-database-id` in `wrangler.jsonc`.
3. Refresh types with `rtk bun run gen`.
4. Build or preview locally:

```bash
rtk bun run build
rtk bun run preview
```

5. Deploy with Wrangler:

```bash
rtk bunx wrangler deploy
```
