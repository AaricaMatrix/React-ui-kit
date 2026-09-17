# Project Documentation

## Project Overview

**What it is.** A small React component library (`@aaru/ui-kit`): 8 reusable UI components — `Button`, `Modal`, `TextInput`, `Checkbox`, `Select`, `Card`, `Badge`, `Tabs` — written in TypeScript, styled with Tailwind CSS, documented in Storybook, and tested with Jest and React Testing Library.

**Why it was built.** Reason not determinable from the code/project history beyond the stated goal: build a small reusable React component library (6-8 components) with Storybook documentation, automated interaction tests, and either a published package or a publicly deployed Storybook site.

**What problem reusable components solve.** A shared, tested, accessible component set means a button, a form field, or a modal is implemented and verified once instead of rebuilt (with inconsistent accessibility and no test coverage) in every project that needs one.

**Intended users.** Developers integrating the package into a React application (via `pnpm add @aaru/ui-kit`), and anyone reviewing the project as a portfolio artifact (recruiters, interviewers, collaborators).

**Project scope.** Eight components covering four categories: action (`Button`), overlay (`Modal`), form input (`TextInput`, `Checkbox`, `Select`), and layout/feedback (`Card`, `Badge`, `Tabs`). The scope deliberately stops there — no data table, date picker, or other complex composite component is implemented.

**Main workflow.** Component implementation → Storybook story (documentation + interaction demo) → Jest/RTL test (automated verification) → library build (`vite build`) → publish to npm registry and/or deploy Storybook to GitHub Pages. This matches what's actually implemented: every component folder contains exactly these three files, and both a publish path (`package.json` `exports`/`files`) and a Pages deploy workflow (`.github/workflows/deploy-storybook.yml`) exist.

## Features

Verified from the code:

- 8 typed, reusable React components, each exported from `src/index.ts` with its prop types
- Tailwind-based styling composed with `clsx`, with a shared brand/danger color palette defined in `tailwind.config.js`
- `forwardRef` support on every component that wraps a single native focusable element (`Button`, `TextInput`, `Checkbox`, `Select`)
- Accessible form-input pattern: `useId()`-generated IDs linking `<label>`, helper text, and error text via `aria-describedby`, with `aria-invalid` set when an `error` prop is present (`TextInput`, `Checkbox`, `Select`)
- Focus-trapping, focus-restoring modal dialog (`Modal`), rendered via `createPortal` into `document.body`
- WAI-ARIA-pattern tab list with roving `tabIndex` and Left/Right/Home/End keyboard navigation (`Tabs`)
- Controlled and uncontrolled usage of `Tabs` (`activeTabId`+`onChange` vs `defaultTabId`)
- Storybook documentation for every component, including `play`-function stories that script and assert on real interactions
- Jest + React Testing Library test coverage for every component (36 tests total, verified by running `pnpm test`)
- Dual ESM/CJS build with bundled type declarations (`vite build` + `vite-plugin-dts`)
- Separate CSS entry point (`@aaru/ui-kit/styles.css`) rather than runtime style injection
- GitHub Actions CI workflow (typecheck, test, build) and a separate GitHub Actions workflow that deploys the built Storybook site to GitHub Pages

## Technology Stack

| Technology | Declared version | Purpose | Where used | Why relevant |
|---|---|---|---|---|
| React | `^19.2.8` (dev dependency; `>=18.0.0` as a peer dependency) | UI library | Every component in `src/components/` | Core framework the components are built on |
| TypeScript | `~6.0.2` | Static typing | All `.ts`/`.tsx` source, `tsconfig.*.json` | Types every component's props and is used to generate `dist/index.d.ts` |
| Tailwind CSS | `^3.4.14` | Utility-first styling | `tailwind.config.js`, `src/styles/globals.css`, class names in every component | Styles are resolved at build time to static CSS rather than a runtime CSS-in-JS cost |
| Vite | `^8.3.0` | Build tool / dev server | `vite.config.ts`, `pnpm dev`, `pnpm build` | Bundles the library in `build.lib` mode to ESM + CJS |
| vite-plugin-dts | `^4.5.0` | Type declaration bundling | `vite.config.ts` | Generates `dist/index.d.ts` from the TypeScript source during the Vite build |
| Storybook | `^10.6.0` (`storybook`, `@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/addon-docs`) | Component documentation and interactive playground | `.storybook/main.ts`, `.storybook/preview.tsx`, every `*.stories.tsx` file | Documents every component with live, interactive examples and accessibility checks (`addon-a11y`) |
| Jest | `^29.7.0` | Test runner | `jest.config.cjs`, every `*.test.tsx` file | Runs the automated interaction tests |
| React Testing Library | `^16.0.1` (`@testing-library/react`), plus `@testing-library/user-event` `^14.5.2` and `@testing-library/jest-dom` `^6.6.3` | Component testing utilities | Every `*.test.tsx` file | Renders components and queries/interacts with them the way a user or assistive technology would |
| Babel | `@babel/core` `^7.26.0` + presets | Test-time TS/JSX transform | `babel.config.cjs`, used by `babel-jest` in `jest.config.cjs` | Transforms TypeScript/JSX for Jest without a separate `ts-jest` compile step |
| clsx | `^2.1.1` | Conditional class-name composition | Every component's `className` logic | Small runtime dependency for combining Tailwind classes conditionally |
| oxlint | `^1.81.0` | Linting | `pnpm lint`, `.oxlintrc.json` | Project linter (present in scripts; not wired into CI as of this documentation) |
| pnpm | `12.4.2` (pinned via `"packageManager"` in `package.json`) | Package manager | `pnpm-lock.yaml`, `pnpm-workspace.yaml`, all install/run commands | See **Package Manager** below |
| Git / GitHub | — | Version control, CI/CD host | `.github/workflows/ci.yml`, `.github/workflows/deploy-storybook.yml` | Hosts the CI pipeline and the Storybook GitHub Pages deployment |
| GitHub Pages | — | Static site hosting | `.github/workflows/deploy-storybook.yml` | Deployment target for the built Storybook site (`storybook-static/`) |

## Package Manager

- **pnpm is the package manager for this project.** This is fixed by the `"packageManager": "pnpm@12.4.2"` field in `package.json`, the presence of `pnpm-lock.yaml` (not `package-lock.json` or `yarn.lock`), and `pnpm-workspace.yaml` (used here to record an approved build script for `esbuild`, a transitive dependency of Vite/Storybook — pnpm blocks postinstall scripts by default and requires this kind of explicit approval).
- **Why pnpm specifically:** Reason not determinable from the code/project history. It is the package manager the project is configured to use, per project requirement.
- **`pnpm-lock.yaml`** pins exact resolved versions of every dependency (direct and transitive) so installs are reproducible across machines and in CI.
- **Key pnpm commands used in this project:**
  ```bash
  pnpm install                  # install all dependencies from pnpm-lock.yaml
  pnpm add <package>             # add a runtime dependency
  pnpm add -D <package>           # add a dev dependency
  pnpm run <script>               # run a package.json script (or just `pnpm <script>`)
  pnpm test                       # run the Jest suite
  pnpm build                      # build the library
  pnpm storybook                  # start the Storybook dev server
  pnpm build-storybook             # build the static Storybook site
  pnpm publish --access public    # publish to the npm registry
  ```
- **Available package scripts** (from `package.json`): `dev`, `build`, `typecheck`, `lint`, `preview`, `test`, `test:watch`, `test:coverage`, `storybook`, `build-storybook`.

## Component Architecture

Each component lives in its own folder under `src/components/`, containing exactly three files: the implementation (`ComponentName.tsx`), its Jest/RTL tests (`ComponentName.test.tsx`), and its Storybook stories (`ComponentName.stories.tsx`). `src/index.ts` re-exports each component and its named types explicitly (no `export *`). Full detail in [ARCHITECTURE.md](./ARCHITECTURE.md) and [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md).

## Development Workflow

Verified from the project's structure and configuration:

1. **Implement** a component in `src/components/ComponentName/ComponentName.tsx`.
2. **Document** it with a Storybook story in the same folder, including at least one interaction (`play` function) for components with interactive behavior.
3. **Test** it with Jest + RTL in the same folder, covering render, interaction, edge/error states, and ref forwarding where applicable.
4. **Export** it from `src/index.ts`.
5. **Verify** with `pnpm typecheck`, `pnpm test`, and `pnpm build` — all three are also run automatically in `.github/workflows/ci.yml` on every push/PR to `main`.
6. **Ship** via `pnpm publish` (npm registry) and/or let `.github/workflows/deploy-storybook.yml` deploy the built Storybook site to GitHub Pages on push to `main`.

## Technical Concepts to Understand

Project-specific application of each concept, not the general definition:

- **Props** — every component's public API is a typed props interface (e.g. `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`), extending the matching native HTML element's attributes so consumers get all native behavior plus the component's additions for free.
- **State** — used internally where a component needs to track something the consumer isn't required to control, e.g. `Tabs`' `internalActiveId` (via `useState`) for uncontrolled usage, and `Modal`'s `dialogRef`/`previouslyFocused` refs for focus management.
- **Event handling** — components accept and forward native event handlers (`onClick`, `onChange`, etc.) via `...rest` prop spreading rather than defining custom event prop names.
- **Component composition** — `Modal` accepts `children` and a separate `footer` slot; `Card` accepts `children`, `title`, `subtitle`, and `footer`; consumers compose their own content into these slots rather than the library trying to anticipate every layout.
- **Controlled inputs** — `Tabs` supports both controlled (`activeTabId` + `onChange`) and uncontrolled (`defaultTabId`, internal state) modes, checked via `const isControlled = activeTabId !== undefined`. The form inputs (`TextInput`, `Checkbox`, `Select`) are controlled or uncontrolled entirely by whether the consumer passes a `value`/`checked` prop, the same as native HTML elements.
- **Conditional rendering** — e.g. `Modal` returns `null` when `!isOpen`; error text replaces helper text (never both) in the form inputs; `Button`'s spinner replaces the leading/trailing icons while `isLoading`.
- **Accessibility** — `aria-invalid`, `aria-describedby`, `role="alert"` on error text, `role="dialog"`/`aria-modal` on the modal, `role="tablist"`/`role="tab"`/`role="tabpanel"`/`aria-selected` on tabs, and keyboard focus management (trap in `Modal`, roving tabindex in `Tabs`) are all implemented directly in the components, not left to the consumer.
- **Storybook** — used here for two purposes: documenting each component's variants/props via `autodocs` + `argTypes`, and demonstrating interactions live via `play` functions that use the same `userEvent`/assertion APIs as the Jest tests.
- **Jest** — the test runner; configured via `jest.config.cjs` with `jsdom` as the environment and `babel-jest` for the TS/JSX transform.
- **React Testing Library** — used to render components and query them by role/label/text (accessible queries) rather than CSS selectors, so tests verify user-facing behavior.
- **User interaction testing** — `@testing-library/user-event` simulates realistic interaction sequences (e.g. focus → keydown → keyup for typing) rather than firing a single synthetic event, matching what a real browser does more closely than `fireEvent`.
- **Package building** — `vite build` in library mode (`build.lib`) produces `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts` (types, via `vite-plugin-dts`), and `dist/ui-kit.css` (compiled Tailwind).
- **pnpm** — see **Package Manager** above.
- **Package publishing** — `package.json`'s `exports` field maps `.` to the ESM/CJS/types builds and `./styles.css` to the compiled CSS; `files: ["dist"]` restricts what actually ships to the npm registry; `react`/`react-dom` are `peerDependencies` so the library doesn't bundle its own React copy.

## Distinguishing Facts, Explanations, and Assumptions

- **Facts verified from the code:** every dependency and version listed above, the file/folder structure, the props and behavior of each component, the Jest/Storybook/Vite configuration, the CI/CD workflow files, and the test count (36, from running `pnpm test`).
- **Engineering explanations:** why Tailwind has no runtime cost, why `peerDependencies` avoids duplicate React copies, why native `<select>` was used instead of a custom listbox — these follow from well-established frontend engineering reasoning applied to what's actually in the code, not from a stated rationale in the project history.
- **Assumptions or unknowns:** why pnpm specifically (vs. npm/yarn) and why this particular set of 8 components (vs. a different 8) are not determinable from the code or project history; they reflect project requirements/preferences that predate or sit outside the source itself.
