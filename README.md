# @aaru/ui-kit

A small, accessible React component library built with TypeScript and Tailwind CSS. Eight components covering the basics you need in most apps: buttons, forms, feedback, and layout.

**[View the live Storybook →](#deploying-storybook)** (link goes live once deployed, see below)

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

Every component is keyboard accessible and wired up with proper ARIA attributes (`aria-invalid`, `aria-describedby`, `role="dialog"`, `role="tablist"`, and so on).

## Install

```bash
pnpm add @aaru/ui-kit
```

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

## Local development

```bash
pnpm install
pnpm dev          # Vite dev server for src/App.tsx (a scratch playground)
pnpm storybook    # Storybook at http://localhost:6006
```

## Testing

Interaction tests are written with Jest and React Testing Library, one test file per component, colocated next to the component (`Button.test.tsx` sits beside `Button.tsx`).

```bash
pnpm test              # run once
pnpm test:watch    # watch mode
pnpm test:coverage # with coverage report
```

Storybook stories also include `play` functions (click, type, keyboard-nav interactions) so the same behavior is documented and demoed visually in Storybook, separate from the Jest suite.

## Building the library

```bash
pnpm typecheck   # tsc, no emit
pnpm build        # bundles ESM + CJS + type declarations to dist/
```

## Publishing to npm

1. Make sure you're logged in: `pnpm login`
2. If you don't own the `@aaru` scope, rename the package first: edit `"name"` in `package.json` (e.g. `@yourscope/ui-kit` or a plain unscoped name like `aaru-ui-kit`).
3. Bump the version: `pnpm version patch` (or `minor` / `major`)
4. Build and publish:
   ```bash
   pnpm build
   pnpm publish --access public
   ```

The `files` and `exports` fields in `package.json` are already set up so only `dist/` ships, and consumers get proper ESM/CJS/type resolution plus a separate `styles.css` entry point.

## Deploying Storybook

Two ready-made GitHub Actions workflows are included in `.github/workflows/`:

- **`ci.yml`** — runs typecheck, tests, and build on every push/PR.
- **`deploy-storybook.yml`** — builds Storybook and deploys it to GitHub Pages on every push to `main`.

To turn the deploy on:

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages** and set the source to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab).
4. Your Storybook will be live at `https://<username>.github.io/<repo-name>/`.

No account or token setup needed since GitHub Pages deploys use the repo's built-in permissions.

If you'd rather not use GitHub Pages, `npx chromatic --project-token=<token>` (after creating a free project at chromatic.com) is a one-command alternative that also gives you visual regression testing.

## Project structure

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
    ...
  index.ts          # public exports
  styles/globals.css
.storybook/
  main.ts
  preview.tsx
.github/workflows/
  ci.yml
  deploy-storybook.yml
```

## License

MIT
