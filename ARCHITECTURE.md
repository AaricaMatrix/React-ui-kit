# Architecture

## Folder layout

Each component owns a folder with three files:

```
src/components/Button/
  Button.tsx          # component + types
  Button.test.tsx     # Jest + RTL tests
  Button.stories.tsx  # Storybook stories
```

This is a **colocation** pattern: everything about `Button` lives under `Button/`, so there's no jumping between a `components/`, `tests/`, and `stories/` tree to understand one piece of UI. It also means a component can be deleted or moved by deleting or moving one folder.

`src/index.ts` is the single public entry point. It re-exports every component and its types explicitly:

```ts
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';
```

Nothing is exported with `export *`. This is deliberate: it keeps the public API surface explicit and makes it obvious in a diff when something new becomes part of the package's contract.

## Build: Vite library mode

The library is built with Vite's `build.lib` mode (`vite.config.ts`), producing:

- `dist/index.js` — ESM build
- `dist/index.cjs` — CommonJS build
- `dist/index.d.ts` — bundled type declarations (via `vite-plugin-dts`)
- `dist/ui-kit.css` — compiled Tailwind output, shipped separately

`react` and `react-dom` are marked `external` in the Rollup config, so the library doesn't bundle its own copy of React; it expects the consuming app to provide one (enforced via `peerDependencies`, `>=18.0.0`).

`package.json` uses the modern `exports` map so consumers get the right build automatically regardless of their module system:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./styles.css": "./dist/ui-kit.css"
}
```

Styles are exported as a separate entry point (`@aaru/ui-kit/styles.css`) rather than injected via a `<style>` tag at runtime. That keeps the JS bundle free of CSS-in-JS overhead and lets consumers control exactly where the stylesheet loads.

## Styling: Tailwind, not CSS-in-JS

Every component uses Tailwind utility classes composed with `clsx`. Two reasons:

1. **No runtime cost.** Styles are resolved at build time into static CSS. There's no style-recalculation or `<style>` injection happening in the browser on every render, which is a real cost with CSS-in-JS libraries at scale.
2. **Consumers already speak Tailwind.** Since `className` is accepted and forwarded on every component, a consuming app using Tailwind can extend or override any component's look without fighting specificity wars or needing a theme-provider API.

The brand color palette (`brand-*`, `danger-*`) is defined once in `tailwind.config.js` and reused across every component, so changing the look of the whole library is a one-file edit.

## Component patterns

**`forwardRef` everywhere a native element is rendered.** `Button`, `TextInput`, `Checkbox`, and `Select` all wrap a native form/interactive element and forward the ref to it. This matters because consumers frequently need direct DOM access — focusing an input programmatically, integrating with a form library that calls `.focus()` on validation error, etc. Components that don't wrap a single focusable element (`Card`, `Badge`, `Tabs`) don't forward a ref, since there's no obvious single DOM node to hand back.

**`useId` for accessible associations.** `TextInput`, `Checkbox`, and `Select` all use React's `useId()` hook to generate stable, unique IDs for linking a `<label>` to its input and an error/helper message to its `aria-describedby`, while still respecting an explicit `id` prop if the consumer passes one. This avoids the common bug of hardcoded IDs colliding when a component is rendered more than once on a page.

**Compound state for errors.** Every form input (`TextInput`, `Checkbox`, `Select`) takes the same shape: an optional `error` string that, when present, switches the input into an invalid visual state, sets `aria-invalid`, and renders the message with `role="alert"` so screen readers announce it immediately. Helper text and error text share the same visual slot — an error always replaces helper text rather than stacking both, so the UI never shows two competing captions at once.

**Modal is portal-based and manages its own focus.** `Modal` renders through `createPortal(..., document.body)` rather than in place in the tree, which avoids z-index and `overflow: hidden` clipping issues from parent containers. On open, it captures the currently focused element, moves focus into the dialog, and traps `Tab`/`Shift+Tab` inside the dialog's focusable elements. On close, it restores focus to whatever was focused before the modal opened. This is the behavior the WAI-ARIA dialog pattern requires, and it's easy to get subtly wrong (most third-party modals people build ad hoc skip focus restoration entirely).

**Tabs follows the WAI-ARIA tabs pattern exactly**, including roving `tabIndex` (only the active tab is in the natural tab order; the others are reachable via arrow keys, matching how native tab widgets behave in OS-level UI).

## Why these 8 components specifically

The set covers the four categories almost every real app needs on day one:

- **Action**: Button
- **Overlay**: Modal
- **Form input**: TextInput, Checkbox, Select
- **Layout/feedback**: Card, Badge, Tabs

It intentionally does not include things like a DataTable, DatePicker, or Autocomplete — those are complex enough to be their own components with their own dedicated design decisions, and adding them without real use-case pressure tends to produce speculative, over-general APIs. Better to ship a small set well than a large set halfway.

## Testing architecture

See [TESTING.md](./TESTING.md) for the full picture. In short: Jest + React Testing Library own correctness (does the component behave right), Storybook `play` functions own visual documentation of interactions (what does the interaction look like), and they deliberately overlap in coverage rather than trying to be a single source of truth — a failure in one doesn't hide a regression the other would catch.
