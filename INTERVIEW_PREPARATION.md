# Interview Preparation

Built specifically around `@aaru/ui-kit` as it actually exists: 8 components, pnpm as the package manager, Jest + RTL for tests, Storybook for docs, not yet published to the npm registry, with a GitHub Pages deploy workflow ready to switch on.

## 60-Second Project Explanation

"I built a small React component library, 8 components covering the basics most apps need on day one: a button, a modal, three form inputs, a card, a badge, and a tab list. Everything's written in TypeScript and styled with Tailwind. Every component is documented in Storybook with live, interactive examples, and every component has Jest and React Testing Library tests that check real user behavior, like clicking, typing, and keyboard navigation, not just that the component renders. I'm using pnpm as the package manager, and I set up GitHub Actions to run the whole test suite in CI and deploy the Storybook site to GitHub Pages automatically. The package itself isn't published to the npm registry yet, but it's fully configured to be, `pnpm publish` and it's live."

## Project Questions

**What did you build?**
A component library with 8 components: `Button`, `Modal`, `TextInput`, `Checkbox`, `Select`, `Card`, `Badge`, `Tabs`. Each one lives in its own folder with the implementation, its tests, and its Storybook stories together.

**Why did you build a component library?**
Reason not determinable from the code/project history beyond the stated goal of demonstrating reusable-component design, Storybook documentation, and automated testing in one self-contained project.

**What problem does it solve?**
Rebuilding the same UI primitives in every project means inconsistent accessibility and no shared test coverage. Centralizing them once, tested and documented, means they get reused instead of reimplemented.

**What components did you create?**
`Button` (actions), `Modal` (overlay/dialog), `TextInput`/`Checkbox`/`Select` (form inputs), `Card` (content container), `Badge` (status labels), `Tabs` (navigation between panels).

**How are the components reusable?**
Every component takes typed props extending the matching native HTML element's attributes, accepts and forwards `className` so consumers can extend styling, and forwards a `ref` to the underlying native element where there is one (`Button`, `TextInput`, `Checkbox`, `Select`). None of them assume anything about the consuming app's routing, state management, or design system beyond Tailwind classes being present.

**How is the project structured?**
`src/components/<Name>/` holds `<Name>.tsx`, `<Name>.test.tsx`, and `<Name>.stories.tsx` together. `src/index.ts` re-exports everything explicitly. Config lives at the root: `.storybook/`, `jest.config.cjs`, `vite.config.ts`, `tailwind.config.js`. `.github/workflows/` holds the CI and Storybook-deploy workflows.

## React Questions

**Why React?**
Reason not determinable from the code/project history beyond it being the specified framework for the project.

**How are props used?**
Every component defines a TypeScript interface for its props, typically extending a native HTML attributes type — e.g. `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>` — so the component gets every native prop (like `onClick`, `disabled`) automatically, plus whatever it adds on top (`variant`, `size`, `isLoading`, etc.).

**How is state handled?**
Most components are stateless; visual state (variant, size, error) is derived directly from props on each render. Where internal state exists, it's narrow and specific: `Tabs` uses `useState` to track the active tab when used uncontrolled, and `Modal` uses refs (not state) to track the dialog node and the previously focused element for focus management.

**How are events handled?**
Native event handlers (`onClick`, `onChange`, etc.) are accepted through prop spreading (`...rest`) and passed straight to the underlying DOM element, rather than the library inventing its own event prop names.

**How are controlled inputs implemented?**
`Tabs` explicitly supports both modes: `const isControlled = activeTabId !== undefined` decides whether to use the `activeTabId` prop or internal state for the current tab. The form inputs (`TextInput`, `Checkbox`, `Select`) don't implement controlled/uncontrolled logic themselves at all — they pass `value`/`checked`/`onChange` straight through to the native element, so they're controlled or uncontrolled exactly the way a plain `<input>` would be.

**How does component composition work?**
Slot-based: `Modal` takes `children` (body) and a separate `footer` prop; `Card` takes `children`, `title`, `subtitle`, and `footer`. The library provides structure; the consumer provides content, including other components from the library (e.g. `Button`s inside a `Modal`'s `footer`).

**How did you make the components reusable?**
By keeping each component's API close to its native HTML equivalent (extend the native attributes type, forward the ref, accept `className`) rather than inventing a parallel API surface. A consumer who knows how a native `<button>` or `<select>` works already knows most of this library's API.

## Storybook Questions

**Why did you use Storybook?**
It's specified as a requirement, and it gives every component an interactive, browsable demo that documents its variants and behavior without needing to run the whole consuming app.

**What problem does Storybook solve?**
Without it, understanding what a component supports means reading its source or its test file. Storybook renders every variant and state live, with controls to change props interactively, so understanding a component's API doesn't require reading code.

**How are stories structured?**
Each `*.stories.tsx` file defines a `meta` object (title, component, default args, `argTypes` for the Storybook controls panel) and one named export per story/state. Most components have one story per meaningful variant or state (e.g. `Button` has `Primary`, `Secondary`, `Danger`, `Ghost`, `Sizes`, `Loading`, `Disabled`), plus at least one story with a `play` function for interactive components.

**How did you document component variants?**
Through separate story exports (one per variant/tone/size) and, where relevant, an "all together" comparison story (`Badge`'s `AllTones`, `Button`'s `Sizes`) so every option is visible at a glance in one place.

**How would another developer use the Storybook?**
Run `pnpm storybook`, browse to a component in the sidebar, and see every documented state. The controls panel (from `argTypes`) lets them change props live and see the result immediately, without writing any code.

**How does Storybook help component development?**
It's a fast feedback loop for building and reviewing a component in isolation, without needing a full app shell around it, and the `play`-function stories double as a visible interaction demo that a Jest test's pass/fail output can't show on its own.

## Testing Questions

**Why Jest?**
It's specified as a requirement, and it's the most common test runner in React codebases, so using it is directly transferable to most teams.

**Why React Testing Library?**
It queries the rendered DOM by role, label, and text — the same way a user or screen reader would find an element — rather than by internal component structure or CSS class, so tests verify behavior rather than implementation detail.

**What is interaction testing?**
Testing what happens when a user does something (clicks a button, types into a field, presses an arrow key), and asserting on the resulting DOM state or a callback being called, rather than just asserting a component rendered without crashing.

**How do you simulate user interaction?**
With `@testing-library/user-event`, which fires the full realistic sequence of events a browser would produce for a given interaction (e.g. focus, then keydown/keypress/input/keyup for each character typed), rather than a single synthetic event.

**What behavior did you test?**
Per component: rendering with the given props/content, the primary interaction (click, type, select, toggle, tab-switch), disabled/loading/error states blocking or changing behavior correctly, relevant ARIA attributes being present and correct, and ref forwarding for components that wrap a native focusable element. `Modal` additionally covers the open/close lifecycle (overlay click, Escape key, close button) and `Tabs` covers keyboard navigation between tabs.

**Why test user behavior instead of implementation details?**
Behavior-focused tests keep passing through internal refactors (renaming a CSS class, restructuring the JSX) as long as the component still behaves correctly for the user, whereas implementation-focused tests (asserting on class names or internal state) break on refactors that didn't actually change anything a user would notice.

**What happens when a test fails?**
`pnpm test` exits non-zero and Jest prints which assertion failed and why (expected vs. received value), pointing at the specific `it(...)` block and line. In CI (`ci.yml`), a failing test blocks the workflow from passing, which is intended to block merging.

## PNPM Questions

**Why is PNPM used in this project?**
Reason not determinable from the code/project history beyond it being the project's specified package manager. What's verifiable from the code: `pnpm-lock.yaml` is the lockfile present (not `package-lock.json` or `yarn.lock`), and `package.json` pins `"packageManager": "pnpm@12.4.2"`.

**What is pnpm-lock.yaml?**
The lockfile that pins the exact resolved version of every dependency, direct and transitive, so `pnpm install` produces an identical `node_modules` on any machine or in CI.

**How do you install dependencies?**
```bash
pnpm install
```

**How do you add a dependency?**
```bash
pnpm add <package>        # runtime dependency
pnpm add -D <package>     # dev dependency
```

**How do you run project scripts?**
```bash
pnpm run <script>
# or, for most scripts:
pnpm <script>
```

**How do you run the test suite?**
```bash
pnpm test
```

**How do you build the library?**
```bash
pnpm build
```

**How do you publish the package using PNPM?**
```bash
pnpm build
pnpm publish --access public
```
(`--access public` is required the first time a scoped package like `@aaru/ui-kit` is published, since npm defaults scoped packages to private.)

## Package Questions

**How is the library packaged?**
`vite build` in library mode outputs `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), `dist/index.d.ts` (bundled TypeScript declarations, via `vite-plugin-dts`), and `dist/ui-kit.css` (compiled Tailwind).

**What is the package entry point?**
`"main": "./dist/index.cjs"`, `"module": "./dist/index.js"`, `"types": "./dist/index.d.ts"` in `package.json`, plus a modern `"exports"` map that resolves `import`/`require`/`types` correctly for whichever module system the consumer uses, and a separate `./styles.css` export for the compiled CSS.

**How are components exported?**
`src/index.ts` explicitly re-exports each component and its named types (e.g. `export { Button } from './components/Button/Button'; export type { ButtonProps, ... }`) — no wildcard `export *`.

**How would another developer install the library?**
```bash
pnpm add @aaru/ui-kit
```
then import from the package root and separately import its stylesheet.

**How would you release a new version?**
```bash
pnpm version <patch|minor|major>
pnpm build
pnpm publish --access public
```
Patch for non-breaking fixes, minor for additive changes (new component, new optional prop), major for anything that breaks an existing consumer's usage.

**What happens during the build?**
Vite bundles `src/index.ts` and everything it imports into ESM and CJS outputs, external-izes `react`/`react-dom` (so they're not bundled), `vite-plugin-dts` generates the type declarations from the TypeScript source, and Tailwind's output is emitted as a separate CSS file.

## Architecture Questions

**Explain your component architecture.**
Each component is self-contained in its own folder (implementation + tests + stories together). Components that wrap a single native focusable element forward a `ref`; form inputs share a consistent pattern for labels, helper text, and error state built on `useId()` and `aria-describedby`.

**Explain the folder structure.**
`src/components/<Name>/` per component; `src/index.ts` as the single public entry point; `src/styles/globals.css` as the Tailwind entry; `.storybook/` for Storybook config; root-level config files (`jest.config.cjs`, `babel.config.cjs`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.*.json`); `.github/workflows/` for CI and the Storybook deploy.

**How does a component move from source code to Storybook?**
The `*.stories.tsx` file in the same folder imports the component and defines a `meta` (title, component, default args) plus named story exports. Storybook's config (`.storybook/main.ts`) globs for `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`, so any new story file is picked up automatically without additional registration.

**How does testing fit into the development workflow?**
Each component's `*.test.tsx` file runs via `pnpm test` (Jest). The `ci.yml` GitHub Actions workflow runs `pnpm typecheck`, `pnpm test`, and `pnpm build` on every push and pull request to `main`, so a regression is caught before merging rather than after.

**How does the library become a distributable package?**
`pnpm build` produces the `dist/` output described above; `package.json`'s `files: ["dist"]` restricts what `pnpm publish` actually uploads to the npm registry, keeping source, tests, and config out of the published package.

## Problem-Solving Questions

**What was the hardest part?**
The modal's focus trap and focus restoration. It's a small amount of code, but easy to get subtly wrong: capturing what was focused before opening, moving focus into the dialog, intercepting `Tab`/`Shift+Tab` to cycle only within the dialog's own focusable elements, and restoring focus on close. "Looks like it works" (clicking with a mouse) and "actually works" (keyboard-only or screen-reader navigation) are different bars, and it had to be tested that way.

**What bugs did you encounter?**
Be specific if you remember one from actually building it — for example, a genuinely encountered issue during this project's setup was a leftover Vitest-browser-testing block in `vite.config.ts` (added automatically by Storybook's init step) that referenced a package not declared as a real dependency; it worked accidentally under npm's flatter dependency resolution but failed immediately once the project switched to pnpm's stricter, non-hoisted `node_modules` layout, because pnpm doesn't let a package resolve something it doesn't explicitly depend on.

**How did you debug them?**
For the pnpm/Vitest issue: read the actual build error (`ERR_MODULE_NOT_FOUND` pointing at the unresolved import), traced it to a stale `vite.config.ts` block referencing tooling the project wasn't using, and removed it rather than trying to install the missing package, since the project uses Jest, not Vitest, for testing.

**What would you improve?**
Visual regression testing (Chromatic) layered on top of the existing Storybook setup, so a styling regression gets caught automatically. A theming API (CSS custom properties or a config object) so consumers can reskin the library without overriding Tailwind classes component by component. Wiring `pnpm lint` (oxlint) into the CI workflow, since it currently exists as a script but isn't run automatically.

**How would you scale from 8 components to 30+?**
Keep the same per-component folder pattern (it doesn't get harder to navigate as it grows, since each component is still self-contained), but introduce a shared internal utilities layer for things multiple components would need in common (e.g. a shared `useControllableState` hook for the controlled/uncontrolled pattern currently written by hand in `Tabs`), rather than duplicating that logic per component.

**How would you introduce theming?**
Replace the hardcoded Tailwind color tokens (`brand-*`, `danger-*` in `tailwind.config.js`) with CSS custom properties that Tailwind's config reads from, so a consumer can override `--color-brand-600` etc. at the document root without needing to fork Tailwind classes inside each component.

**How would you improve accessibility?**
Add automated accessibility assertions to the Jest suite (e.g. `jest-axe`) so accessibility regressions are caught by the test suite itself, not just by the Storybook `addon-a11y` panel during manual review.

**How would you prevent breaking changes?**
Treat the props interfaces exported from `src/index.ts` as the contract: any change to a prop's name, type, or default value is a breaking change requiring a major version bump, and would ideally be caught by an API-diffing tool (e.g. `api-extractor`) run in CI rather than relying on manually remembering.

**How would you handle component versioning?**
Standard semver via `pnpm version <patch|minor|major>`, tied to the categories above: patch for internal fixes, minor for additive/non-breaking changes, major for anything that changes an existing prop's contract or removes a component.

---

## Things I Must Understand Before the Interview

1. Why every form input (`TextInput`, `Checkbox`, `Select`) uses `useId()` and how `aria-describedby`/`aria-invalid` actually get wired to it — be able to point at the exact lines.
2. How `Modal`'s focus trap works step by step: capture on open, move focus in, intercept Tab, restore on close.
3. How `Tabs` decides controlled vs. uncontrolled (`activeTabId !== undefined`) and what roving `tabIndex` means and why it matters.
4. Why `react`/`react-dom` are `peerDependencies` and not `dependencies`, and what breaks if they weren't.
5. What the `exports` map in `package.json` does and why it matters for ESM vs. CJS consumers.
6. The difference between what Jest tests verify and what the Storybook `play` functions demonstrate, and why both exist.
7. Why RTL queries by role/label instead of CSS class or test ID, and what that buys you across a refactor.
8. What `forwardRef` is doing in `Button`/`TextInput`/`Checkbox`/`Select` and why `Card`/`Badge`/`Tabs` don't use it.
9. What pnpm's strict, non-hoisted `node_modules` actually changes versus npm, concretely (a phantom dependency that works under npm can fail under pnpm) — and be ready to explain the real example from this project (the leftover Vitest config).
10. The full pipeline: component → story → test → `pnpm build` → CI → publish/deploy, and which file or command corresponds to each step.
11. What `vite-plugin-dts` does and why it's needed in addition to `vite build`.
12. Why the library ships CSS as a separate `styles.css` entry point instead of injecting styles at runtime.
13. The actual test count (36) and be able to open any one test file and explain a specific assertion in it, cold.

## Potential Interview Red Flags

An interviewer is likely to notice, and probe on, any of the following if they aren't solid:

- **React implementation** — can't explain why a specific component is structured the way it is, or can't read its own `.tsx` file fluently on request.
- **Component reusability** — can't articulate what makes these components more reusable than a one-off implementation (the native-attribute-extension pattern, forwarded refs, `className` passthrough).
- **Props/state** — confuses "control" (via props) with "state" (internal), or can't explain the controlled/uncontrolled distinction in `Tabs`.
- **Storybook** — can't explain what a `play` function actually does, or claims Storybook is "for testing" when its role here is documentation/demonstration, distinct from the Jest suite.
- **Testing** — can't explain why RTL queries avoid CSS classes/test IDs, or can't name what a specific test in the suite actually checks.
- **Jest** — doesn't know what `jest.config.cjs` does or why `babel-jest` is there instead of `ts-jest`.
- **React Testing Library** — describes it as "just like Enzyme" or can't explain the behavior-vs-implementation testing philosophy.
- **PNPM** — can't explain what `pnpm-lock.yaml` is for, or slips into describing npm commands when asked to walk through the workflow.
- **Package structure** — can't explain what `files: ["dist"]` or the `exports` map do, or why they matter.
- **Build process** — can't explain what `vite build` in library mode produces, or why React is externalized.
- **Publishing** — claims the package is published when it isn't, or can't explain what would need to happen to actually publish it.
- **Architecture** — can't explain the component-folder pattern or draw the pipeline from source to shipped package from memory.
- **Accessibility** — can describe accessibility features in the abstract but can't point to the specific ARIA attribute or keyboard-handling code that implements them in this project.
