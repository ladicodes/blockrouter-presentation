# BlockRouter presentation deck

An interactive presentation site for the BlockRouter Turbin3 capstone. It runs fully offline: no wallet, RPC, or relayer is needed.

## Run it

```sh
npm install          # first time only
npm run build
npm run start        # http://localhost:3000
```

For editing with hot reload, use `npm run dev`. `npm run check` runs the type-check, lint, and production build together.

Once dependencies are installed, nothing needs the network: fonts are bundled through `@fontsource`. Only the outbound links on the closing slide go online.

## Presenting

| Key | Action |
|---|---|
| ← → / PgUp PgDn | Previous / next slide (works with most clickers) |
| 1–9, 0 | Jump to slide 1–10 |
| A / D | Jump to Architecture / Demo |
| Enter, Shift+Enter | Demo: next / previous step |
| R | Demo: reset |
| N or S | Speaker notes |
| F | Full screen |
| ? | Shortcut list |

Every slide has a URL hash for deep links, e.g. `/#architecture` or `/#demo`.

## Before presenting

- Fill in contributions in `src/content/team.ts`. They are placeholders on purpose.
- Speaker notes live in `src/components/slides/index.ts`.

## What is real vs simulated

- **From the repository:** account seeds and fields, instruction names, checks and error names, model rates (`deployments/devnet.json`), the devnet program ID, CLI command syntax, and relayer routes. They live in `src/lib/facts.ts` and `src/content/*.ts`. Source repository: https://github.com/haileyesus2433/BlockRouter
- **Simulated:** the payment demo (`src/content/demo.ts`) computes charges with the program's exact formula, `(prompt × rate + completion × rate) / 1e6`, rounded down. The token counts and request totals are illustrative, and no transaction is ever built or sent.
- **Representative:** terminal output on the Developer Experience slide follows the CLI's output formats, with placeholder addresses and keys.
- **Not built in BlockRouter yet:** the protocol fee deduction, sponsor vaults and allowances, escrow and disputes, and a pause toggle. The deck labels these as not built.

## Structure

```
src/
  app/                 layout, global styles and design tokens
  components/Deck.tsx  slide shell: navigation, keyboard, notes, full screen
  components/slides/   one file per slide, plus index.ts (order + notes)
  components/diagrams/ hero flow and interactive architecture SVGs
  components/demo/     animated amount display
  content/             architecture, demo, terminal, and team data
  lib/                 repo facts and pricing math
```
