# Component Guide

All components are exported from the package root:

```tsx
import { Button, Modal, TextInput, Checkbox, Select, Card, Badge, Tabs } from '@aaru/ui-kit';
import '@aaru/ui-kit/styles.css';
```

---

## Button

**Purpose:** A button for triggering actions. Supports variants, sizes, a loading state, and optional leading/trailing icons.

**Location:** `src/components/Button/Button.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | No | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Button size |
| `isLoading` | `boolean` | No | `false` | Shows a spinner, sets `aria-busy`, and disables interaction |
| `leftIcon` | `ReactNode` | No | — | Icon rendered before the label (hidden while loading) |
| `rightIcon` | `ReactNode` | No | — | Icon rendered after the label (hidden while loading) |
| `fullWidth` | `boolean` | No | `false` | Stretches the button to fill its container |
| ...rest | `ButtonHTMLAttributes<HTMLButtonElement>` | No | — | All native button props (`onClick`, `disabled`, `type`, etc.) |

**Variants:** `primary`, `secondary`, `danger`, `ghost` (via `variant`); `sm`, `md`, `lg` (via `size`).

**Events:** Native button events (`onClick`, etc.) via prop spreading. Blocked while `disabled` or `isLoading`.

**State:** Stateless; `isDisabled` is derived from `disabled || isLoading` on each render.

**Accessibility:** Sets `aria-busy` while loading and `aria-disabled` when disabled or loading, in addition to the native `disabled` attribute.

**Usage:**

```tsx
<Button variant="danger" size="sm" onClick={handleDelete}>
  Delete project
</Button>

<Button isLoading>Saving...</Button>
```

Ref forwards to the underlying `<button>` (`forwardRef<HTMLButtonElement, ButtonProps>`).

**Storybook:** Stories for each variant (`Primary`, `Secondary`, `Danger`, `Ghost`), a `Sizes` story rendering all three sizes side by side, `Loading` and `Disabled` state stories, and two interaction stories with `play` functions: `ClickInteraction` (asserts `onClick` fires once on click) and `LoadingDisablesClick` (asserts the button is disabled and `onClick` does not fire while loading).

**Testing:** `Button.test.tsx` covers: renders its label, calls `onClick` when clicked, does not call `onClick` when disabled, shows a spinner and blocks clicks while loading (asserts `aria-busy` and the spinner test ID), applies the requested variant/size classes, and forwards a ref to the underlying `<button>`.

---

## Modal

**Purpose:** An accessible dialog rendered in a portal. Traps focus while open, restores focus on close, and closes on Escape or an overlay click.

**Location:** `src/components/Modal/Modal.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `isOpen` | `boolean` | Yes | — | Whether the modal is visible |
| `onClose` | `() => void` | Yes | — | Called on Escape, overlay click, or the close button |
| `title` | `string` | No | — | Heading text; also used as the dialog's accessible label |
| `children` | `ReactNode` | No | — | Body content |
| `footer` | `ReactNode` | No | — | Typically action buttons |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Dialog max-width |
| `closeOnOverlayClick` | `boolean` | No | `true` | Set `false` to require an explicit close action |

**Variants:** `sm`, `md`, `lg` sizes (max-width only).

**Events:** `onClose` is the only callback; it fires from three sources — Escape key, overlay click (if enabled), and the close button.

**State:** Internal only — `dialogRef` (the dialog DOM node) and `previouslyFocused` (the element focused before the modal opened, restored on close). Open/closed state itself is fully controlled by the consumer via `isOpen`.

**Accessibility:** Renders through `createPortal` to `document.body`. On open: captures `document.activeElement`, then focuses the first focusable element inside the dialog (or the dialog itself if none exist). While open: intercepts `Tab`/`Shift+Tab` to cycle focus only within the dialog's focusable elements (a focus trap), and listens for `Escape` to close. Sets `role="dialog"`, `aria-modal="true"`, and `aria-label` (from `title`). Locks page scroll (`document.body.style.overflow = 'hidden'`) while open. On close: restores focus to the element that had it before the modal opened.

**Usage:**

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete project"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  This action cannot be undone.
</Modal>
```

`Modal` does not forward a ref (it doesn't render a single element the consumer would need direct access to; its DOM node is managed internally via `dialogRef`).

**Storybook:** A `ModalDemo` wrapper component (since `Modal` is fully controlled) provides local `isOpen` state for the stories. `Default` and `WithFooterActions` demonstrate static configurations. `OpenAndCloseInteraction` and `EscapeClosesModal` are `play`-function stories that open the modal via the trigger button, assert the dialog is visible (queried from `document.body` since the modal portals outside the story's canvas), then close it via the close button or the Escape key and assert the dialog is removed.

**Testing:** `Modal.test.tsx` covers the same behaviors that are demonstrated in Storybook: opening/closing, the overlay click and Escape key close paths, and rendering into a portal.

---

## TextInput

**Purpose:** A labeled text input with helper or error text underneath.

**Location:** `src/components/TextInput/TextInput.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `label` | `string` | No | — | Visible label text |
| `helperText` | `string` | No | — | Shown below the input when there is no error |
| `error` | `string` | No | — | When present, the input is marked invalid and this replaces helper text |
| ...rest | `InputHTMLAttributes<HTMLInputElement>` | No | — | All native input props (`value`, `onChange`, `placeholder`, `required`, `disabled`, etc.) |

**Variants:** None beyond native input types passed through `...rest` (e.g. `type="email"`).

**Events:** Native input events (`onChange`, `onBlur`, etc.) via prop spreading.

**State:** Stateless; controlled or uncontrolled entirely based on whether the consumer passes `value`.

**Accessibility:** Uses `useId()` to generate a stable `inputId` (or uses a consumer-supplied `id`). Links the `<label>` via `htmlFor`. Links helper or error text via `aria-describedby` (pointing at `helperId` or `errorId`). Sets `aria-invalid` when `error` is present. Error text is rendered with `role="alert"`. A `required` prop adds a visible red asterisk next to the label in addition to the native `required` attribute.

**Usage:**

```tsx
<TextInput label="Email address" placeholder="you@example.com" required />

<TextInput
  label="Email address"
  error="Enter a valid email address"
  defaultValue="not-an-email"
/>
```

Ref forwards to the underlying `<input>`.

**Storybook:** `Default`, `WithHelperText`, `WithError`, `Required`, and `Disabled` stories cover each visual/prop state. `TypingInteraction` is a `play`-function story that types into the input via `userEvent.type` and asserts the resulting value.

**Testing:** `TextInput.test.tsx` verifies rendering with a label, associating helper/error text via `aria-describedby`, setting `aria-invalid` when an error is present, and ref forwarding.

---

## Checkbox

**Purpose:** A labeled checkbox with an optional error message.

**Location:** `src/components/Checkbox/Checkbox.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `label` | `string` | Yes | — | Visible label, also the accessible name |
| `error` | `string` | No | — | Error message shown below, with `role="alert"` |
| ...rest | `Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>` | No | — | All native checkbox props except `type` (fixed to `checkbox`) |

**Variants:** None.

**Events:** Native input events (`onChange`, etc.) via prop spreading.

**State:** Stateless; controlled or uncontrolled based on whether `checked` is passed.

**Accessibility:** `useId()`-generated `inputId` links the `<label>` via `htmlFor`; label wraps both the input and its text so clicking the text also toggles the checkbox. `aria-invalid` and `aria-describedby` are set when `error` is present, matching the `TextInput` pattern.

**Usage:**

```tsx
<Checkbox label="Accept terms and conditions" required />
<Checkbox label="Accept terms and conditions" error="You must accept the terms to continue" />
```

Ref forwards to the underlying `<input type="checkbox">`.

**Storybook:** `Default`, `Checked`, `WithError`, and `Disabled` stories. `ToggleInteraction` is a `play`-function story that asserts the checkbox starts unchecked, clicks it, and asserts it becomes checked.

**Testing:** `Checkbox.test.tsx` verifies rendering with its label, toggling on click, error state rendering with `role="alert"`, and ref forwarding.

---

## Select

**Purpose:** A labeled native `<select>` with a placeholder option, helper text, and error state.

**Location:** `src/components/Select/Select.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `label` | `string` | No | — | Visible label |
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | Yes | — | The list of selectable options |
| `placeholder` | `string` | No | — | Rendered as a disabled first `<option>` |
| `error` | `string` | No | — | Error message; replaces helper text |
| `helperText` | `string` | No | — | Helper text shown when there's no error |
| ...rest | `SelectHTMLAttributes<HTMLSelectElement>` | No | — | All native select props |

**Variants:** None beyond the options list itself; individual options can be marked `disabled`.

**Events:** Native select events (`onChange`, etc.) via prop spreading.

**State:** Stateless; controlled or uncontrolled based on whether `value` is passed. Defaults to an empty string when a `placeholder` is set and no `defaultValue`/`value` is given, so the placeholder shows as the initial selection.

**Accessibility:** Same `useId()` + `aria-describedby` + `aria-invalid` pattern as `TextInput`. Uses a native `<select>` rather than a custom listbox component, which provides built-in keyboard support, mobile OS picker UI, and screen reader support without additional implementation.

**Usage:**

```tsx
<Select
  label="Degree"
  placeholder="Choose a degree"
  options={[
    { value: 'bca', label: 'BCA' },
    { value: 'btech', label: 'B.Tech' },
    { value: 'mca', label: 'MCA', disabled: true },
  ]}
/>
```

Ref forwards to the underlying `<select>`.

**Storybook:** `Default`, `WithHelperText`, `WithError`, and `Disabled` stories, all using a shared `options` array (BCA / B.Tech / MCA, with MCA disabled). `SelectInteraction` is a `play`-function story that selects an option via `userEvent.selectOptions` and asserts the resulting value.

**Testing:** `Select.test.tsx` verifies rendering the label and options, the placeholder appearing as a disabled first option, selecting an option, error state rendering, and ref forwarding.

---

## Card

**Purpose:** A simple content container with an optional header and footer.

**Location:** `src/components/Card/Card.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `title` | `ReactNode` | No | — | Header title |
| `subtitle` | `ReactNode` | No | — | Header subtitle |
| `footer` | `ReactNode` | No | — | Footer content |
| `noPadding` | `boolean` | No | `false` | Removes default padding, for content that manages its own spacing (e.g. an image) |
| ...rest | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | No | — | All native div props except `title` (redefined above as `ReactNode`) |

**Variants:** None (header/footer sections render conditionally based on whether `title`/`subtitle`/`footer` are provided).

**Events:** None specific to `Card`; native div events pass through `...rest`.

**State:** Stateless; `hasHeader` is derived on each render from `Boolean(title || subtitle)`.

**Accessibility:** No component-specific ARIA; renders semantic HTML (`h3` for the title) but relies on the consumer for broader page landmark structure.

**Usage:**

```tsx
<Card title="Welcome" subtitle="Here's what's new">
  Content goes here.
</Card>

<Card noPadding>
  <img src="/banner.png" alt="" className="w-full" />
</Card>
```

`Card` does not forward a ref.

**Storybook:** `Default`, `WithFooter` (rendering `Button` components as footer actions), `BodyOnly` (no header), and `NoPadding` (an edge-to-edge image) stories.

**Testing:** `Card.test.tsx` verifies conditional rendering of the header (present only when `title`/`subtitle` given), the footer, and the `noPadding` class behavior.

---

## Badge

**Purpose:** A small pill for status, category, or count labels.

**Location:** `src/components/Badge/Badge.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `tone` | `'neutral' \| 'brand' \| 'success' \| 'danger' \| 'warning'` | No | `'neutral'` | Color tone |
| ...rest | `HTMLAttributes<HTMLSpanElement>` | No | — | All native span props |

**Variants:** Five tones: `neutral`, `brand`, `success`, `danger`, `warning`.

**Events:** None specific; native span events pass through `...rest`.

**State:** Stateless.

**Accessibility:** No component-specific ARIA; renders as a `<span>` with color conveyed via both background and text color (not color alone).

**Usage:**

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="danger">Failed</Badge>
```

`Badge` does not forward a ref.

**Storybook:** One story per tone (`Neutral`, `Brand`, `Success`, `Danger`, `Warning`) plus an `AllTones` story rendering all five together for visual comparison.

**Testing:** `Badge.test.tsx` verifies rendering its children and applying the correct tone class for each of the five tones.

---

## Tabs

**Purpose:** An accessible tab list following the WAI-ARIA tabs pattern, with Left/Right/Home/End arrow-key navigation.

**Location:** `src/components/Tabs/Tabs.tsx`

**Props:**

| Name | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `tabs` | `{ id: string; label: string; content: ReactNode; disabled?: boolean }[]` | Yes | — | Tab definitions |
| `defaultTabId` | `string` | No | first enabled tab's `id` | Uncontrolled: initial selected tab |
| `activeTabId` | `string` | No | — | Controlled: currently selected tab |
| `onChange` | `(id: string) => void` | No | — | Called whenever the selected tab changes |
| `className` | `string` | No | — | Applied to the outer wrapper |

**Variants:** None beyond controlled/uncontrolled usage.

**Events:** `onChange(id)` fires on both click selection and keyboard navigation.

**State:** `internalActiveId` (via `useState`) holds the selected tab when uncontrolled. `isControlled = activeTabId !== undefined` determines which mode is active; when controlled, `selectTab` calls `onChange` without touching internal state.

**Accessibility:** `role="tablist"` on the tab row, `role="tab"` with `aria-selected` and `aria-controls` on each tab button, `role="tabpanel"` with `aria-labelledby` on the content panel. Only the active tab has `tabIndex={0}`; all others have `tabIndex={-1}` (roving tabindex), so Tab/Shift+Tab moves focus in and out of the tab list as one stop, while Left/Right/Home/End move between tabs once inside it — matching native OS tab-widget behavior.

**Usage:**

Uncontrolled:

```tsx
<Tabs
  tabs={[
    { id: 'profile', label: 'Profile', content: <ProfileForm /> },
    { id: 'security', label: 'Security', content: <SecurityForm /> },
    { id: 'billing', label: 'Billing', content: <BillingForm />, disabled: true },
  ]}
  defaultTabId="security"
/>
```

Controlled:

```tsx
<Tabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
```

`Tabs` does not forward a ref (it renders multiple interactive elements, not one).

**Storybook:** `Default` and `DefaultTabSelected` (starting on a non-first tab) demonstrate static configuration. `ClickToSwitch` is a `play`-function story that clicks a tab and asserts the panel content changes. `KeyboardNavigation` focuses the first tab, sends an `ArrowRight` key, and asserts focus moved to the next tab.

**Testing:** `Tabs.test.tsx` verifies rendering all tabs, switching the active panel on click, skipping disabled tabs during keyboard navigation, and correct `aria-selected`/`role` attributes.
