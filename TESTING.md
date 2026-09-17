# Testing

## Stack

- **Jest** as the test runner
- **React Testing Library (RTL)** for rendering and querying components
- **@testing-library/user-event** for simulating real user interactions (typing, clicking, keyboard nav) rather than firing raw DOM events
- **@testing-library/jest-dom** for readable matchers (`toBeInTheDocument()`, `toBeDisabled()`, `toHaveAttribute()`, etc.)
- **jsdom** as the test environment
- **babel-jest** to transform TypeScript/JSX, so tests run without a separate `ts-jest` compile step

## Configuration

`jest.config.cjs`:

```js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/storybook-static/'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/*.test.{ts,tsx}',
    '!src/components/**/*.stories.{ts,tsx}',
  ],
};
```

A few things worth knowing:

- **CSS imports are mocked** via `identity-obj-proxy`, since Jest doesn't need to process Tailwind's compiled output to test component behavior.
- **`jest.setup.ts`** just imports `@testing-library/jest-dom` once, so its matchers are available in every test file without a per-file import.
- **Coverage excludes test and story files themselves** so the coverage percentage reflects actual component code, not test scaffolding.

`babel.config.cjs` handles the TS/JSX transform:

```js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
```

## Running tests

```bash
pnpm test              # run once
pnpm test:watch    # watch mode, reruns on file change
pnpm test:coverage # adds a coverage report
```

## Debugging a failing test

- **Narrow it down first.** Run a single file instead of the whole suite: `pnpm test -- Button.test.tsx`. In watch mode (`pnpm test:watch`), Jest's interactive prompt lets you filter by filename or test name (press `p` or `t`) without retyping the command.
- **Read the diff Jest prints.** A failed assertion shows expected vs. received values directly in the terminal output — for a DOM assertion (e.g. `toHaveAttribute`), this usually shows exactly what attribute or value was actually present, which is normally enough to spot the mismatch without adding a debug statement.
- **Print the rendered DOM when the failure isn't obvious.** `screen.debug()` (from `@testing-library/react`) inside a test prints the current DOM tree to the terminal, which is the fastest way to see why a `getByRole`/`getByLabelText` query isn't finding what you expect.
- **Check for an async timing issue.** If a query fails right after a state-changing interaction (a click that triggers a re-render, an open animation, etc.), the usual cause is missing an `await` on the `user-event` call, or needing `findBy*`/`waitFor` instead of `getBy*` for something that appears asynchronously.
- **Confirm it's not a query-specificity issue.** A `getByRole` or `getByLabelText` throwing "found multiple elements" usually means the test needs a more specific matcher (e.g. `{ name: 'exact label' }`) rather than the component being broken.

## Testing philosophy: behavior, not implementation

Every test file queries the DOM the way a user or assistive technology would — by role, label, and text — rather than by CSS class or internal component state. This is RTL's core idea: `getByRole('button', { name: 'Save changes' })`, not `wrapper.find('.btn-primary')`. Tests written this way don't break when you refactor a component's internals or restyle it; they only break when the actual user-facing behavior changes.

Example, from `Button.test.tsx`:

```tsx
describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    // ...
  });

  it('shows a spinner and blocks clicks while loading', async () => {
    // ...
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

Each component's test file covers the same shape of ground, adapted to what that component actually does:

- **Rendering**: does it render with the label/content/props it's given
- **Interaction**: does clicking, typing, selecting, or toggling do what it should, verified with `user-event` so the sequence of events matches a real browser interaction
- **Disabled/loading/error states**: does the component correctly block interaction or change its accessible state when it should
- **Accessibility wiring**: are `aria-*` attributes present and correct (e.g. `aria-invalid` on an errored input, `role="dialog"` on the open modal, `aria-selected` on the active tab)
- **Ref forwarding**: for components that wrap a native element, does the ref actually reach it

36 tests currently cover the 8 components — roughly 4-6 per component depending on how much surface area there is to cover (`Modal` and `Tabs` have more interaction paths than `Badge`, so they have more tests).

## Storybook `play` functions: a second layer, on purpose

Every story file also includes at least one story with a `play` function — a scripted interaction that runs automatically when the story loads in Storybook, using the same `userEvent` and assertion primitives as the Jest tests (via the `storybook/test` package).

```tsx
export const ClickInteraction: Story = {
  args: { children: 'Click me' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Click me' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

This is deliberately overlapping with the Jest suite, not a replacement for it. The two serve different purposes:

- **Jest** is the source of truth for correctness. It runs in CI on every push, fails the build on a regression, and produces a coverage number.
- **Storybook `play` functions** are documentation you can watch happen. Anyone browsing the component library — a teammate, a reviewer, an interviewer — can open a story and see the exact interaction (click, type, tab-navigate) play out against the real rendered component, with no separate test runner or terminal output to interpret.

Having both means a reviewer doesn't have to choose between "trust the green checkmark" and "actually see it work."

## Adding a test for a new component

1. Create `ComponentName.test.tsx` next to `ComponentName.tsx`.
2. Import `render`, `screen` from `@testing-library/react` and `userEvent` from `@testing-library/user-event`.
3. Cover, at minimum: default render, the primary interaction, one disabled/error/edge-case state, and ref forwarding if the component forwards one.
4. Query by role/label text, not by class name or test ID, unless there's genuinely no accessible way to identify the element (in which case, that's usually a sign the component is missing an ARIA attribute it should have).
