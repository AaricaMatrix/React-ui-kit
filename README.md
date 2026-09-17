# @aaru/ui-kit

A small, accessible React component library. Eight reusable components — buttons, a modal, form inputs, a card, a badge, and tabs — built with TypeScript and Tailwind CSS, documented in Storybook, and covered by Jest + React Testing Library tests.

## The problem this solves

Most projects rebuild the same handful of UI primitives (a button, a form field, a modal) from scratch every time, with slightly different accessibility behavior and no shared test coverage. This library centralizes those primitives once, tested and documented, so they can be reused across projects instead of re-implemented.

## Key features

- 8 components covering action, overlay, form-input, and layout/feedback needs
- Full TypeScript types on every prop
- Every interactive component is keyboard accessible (focus trap in the modal, arrow-key navigation in tabs, `aria-invalid`/`aria-describedby` wiring on form inputs)
- Every component documented and demoed interactively in Storybook
- Every component covered by Jest + React Testing Library tests, run in CI
- Builds to both ESM and CommonJS with bundled TypeScript declarations

## Components

| Component | What it does |
|---|---|
| `Button` | Variants (primary, secondary, danger, ghost), sizes, loading state, icons |
| `Modal` | Portal-based dialog with focus trap, Escape-to-close, and overlay click |
| `TextInput` | Labeled text field with helper text and error state |
| `Checkbox` | Labeled checkbox with error state |
| `Select` | Labeled native select with placeholder and options |
| `Card` | Content container with optional header, footer, and padding control |
| `Badge` | Small status/label pill with five tones |
| `Tabs` | Accessible tab list following the WAI-ARIA pattern, with arrow-key navigation |

Full prop-level reference: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md).

## Tech stack

React 19, TypeScript, Tailwind CSS, Vite (library mode), Storybook 10, Jest, React Testing Library, pnpm. Full breakdown with versions and rationale: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## Storybook

Every component has a story file covering its default state, its variants, and (for interactive components) a `play`-function story that scripts a real interaction (click, type, keyboard navigation) and asserts on the result.

```bash
pnpm storybook
```

opens the interactive component browser at `http://localhost:6006`.

**Public Storybook URL:** not yet deployed. A GitHub Actions workflow (`.github/workflows/deploy-storybook.yml`) is already set up to build and deploy Storybook to GitHub Pages on every push to `main` — see [PUBLISHING.md](./PUBLISHING.md) for the one settings toggle needed to turn it on.

## Testing

36 tests across the 8 component test files, run with Jest and React Testing Library. Tests query by role and label text (not CSS class), so they verify behavior rather than markup structure. Full detail: [TESTING.md](./TESTING.md).

## Package status

Not yet published to the npm registry. `package.json` is fully configured for publishing (`exports` map, `files`, peer dependencies on React) — publishing is a `pnpm publish` away once the package scope is confirmed. See [PUBLISHING.md](./PUBLISHING.md).

## Installation

This package manager for this project is **pnpm**. All commands below use pnpm.

```bash
pnpm add @aaru/ui-kit
```

## Basic usage

```tsx
import { Button, Card } from '@aaru/ui-kit';
import '@aaru/ui-kit/styles.css';

function App() {
  return (
    <Card title="Welcome">
      <Button variant="primary">Get started</Button>
    </Card>
  );
}
```

## Project structure

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
    Modal/
    TextInput/
    Checkbox/
    Select/
    Card/
    Badge/
    Tabs/
  index.ts               # public exports
  styles/globals.css      # Tailwind entry point
.storybook/
  main.ts
  preview.tsx
.github/workflows/
  ci.yml
  deploy-storybook.yml
```

## Available scripts

All run with `pnpm <script>`, for example `pnpm build`:

| Script | What it does |
|---|---|
| `dev` | Starts the Vite dev server for `src/App.tsx`, a local scratch playground |
| `build` | Builds the library to `dist/` (ESM, CJS, type declarations, CSS) |
| `typecheck` | Runs `tsc --noEmit` against the library source (`tsconfig.build.json`) |
| `lint` | Runs `oxlint` |
| `preview` | Previews the Vite build output |
| `test` | Runs the Jest test suite once |
| `test:watch` | Runs Jest in watch mode |
| `test:coverage` | Runs Jest with a coverage report |
| `storybook` | Starts Storybook at `localhost:6006` |
| `build-storybook` | Builds the static Storybook site to `storybook-static/` |

## Running the project locally

```bash
pnpm install
pnpm storybook   # browse components
pnpm test        # run the test suite
pnpm build       # build the library
```

## Publishing / deploying

See [PUBLISHING.md](./PUBLISHING.md) for the full pnpm-based publish workflow and the GitHub Pages Storybook deploy.

## License

MIT (declared in `package.json`).
