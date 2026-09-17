# Publishing

**Package manager vs. package registry:** this project uses **pnpm** as its package manager (the tool that installs dependencies and runs scripts, per `pnpm-lock.yaml` and the `"packageManager"` field in `package.json`). The **npm registry** is the package registry — the actual hosting service where the built package would be published and downloaded from. `pnpm publish` publishes to the npm registry; pnpm is the client used to do it, not a separate registry.

## Publishing status

**Not currently published.** No version of `@aaru/ui-kit` exists on the npm registry as of this documentation; the steps below describe what publishing looks like once it happens, not something already live.

## Publishing the package to npm

The package is currently scoped as `@aaru/ui-kit`. Before publishing for real:

1. **Confirm you own the scope**, or rename it. If `@aaru` isn't your npm scope, change `"name"` in `package.json` to something you do own — `@yourscope/ui-kit`, or a plain unscoped name like `aaru-ui-kit`.
2. **Log in**: `pnpm login`
3. **Bump the version**: `pnpm version patch` (or `minor` / `major`, following semver — patch for fixes, minor for new components/props that don't break existing usage, major for anything that does)
4. **Build and publish**:
   ```bash
   pnpm build
   pnpm publish --access public
   ```
   `--access public` is required the first time you publish a scoped package (`@scope/name`); npm defaults scoped packages to private otherwise, which fails on a free account.

### Why publishing "just works" once you run it

The `package.json` is already set up so npm knows exactly what to ship and how consumers should resolve it:

```json
"files": ["dist"],
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./styles.css": "./dist/ui-kit.css"
}
```

- `"files": ["dist"]` means only the built output ships to npm — no source, no tests, no `.storybook/` config, no `node_modules`. Keeps the published package small.
- The `exports` map means a consumer using `import` gets the ESM build, one using `require` gets the CJS build, and TypeScript resolves types automatically, all without them needing to know or care which module system the library was authored in.
- `react` and `react-dom` are `peerDependencies`, not `dependencies` — the library doesn't bundle its own React, so consumers don't end up with two copies of React in their bundle (a classic source of "Invalid hook call" errors).

### Verifying a build before publishing

`pnpm build` runs the actual bundler. Before publishing, it's worth also running:

```bash
pnpm typecheck   # confirms the public API's types are valid
pnpm test         # confirms nothing regressed
```

Both are wired into the `ci.yml` workflow (below), so a PR that breaks either won't merge cleanly regardless of whether you remember to run them locally.

### Installing and testing the published package

Once published, another project installs it the same way any pnpm dependency is installed:

```bash
pnpm add @aaru/ui-kit
```

To sanity-check a freshly published version before relying on it in a real project, `pnpm dlx` can pull it into a throwaway environment, or you can `pnpm add` it into a scratch app and confirm the import works:

```tsx
import { Button } from '@aaru/ui-kit';
import '@aaru/ui-kit/styles.css';
```

If the import resolves and the component renders with its expected styling, the `exports` map and the shipped `dist/` files are correct.

## Deploying Storybook

Two GitHub Actions workflows live in `.github/workflows/`:

### `ci.yml`

Runs on every push and pull request to `main`: install, typecheck, test, build. This is the safety net — a broken component or a failing test blocks the PR rather than reaching `main`.

### `deploy-storybook.yml`

Runs on every push to `main`: builds the static Storybook site (`pnpm build-storybook`) and deploys it to GitHub Pages via GitHub's official Pages Actions (`upload-pages-artifact` / `deploy-pages`).

To turn this on:

1. Push the repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`, or trigger the workflow manually from the **Actions** tab (`workflow_dispatch` is enabled).
4. The site goes live at `https://<username>.github.io/<repo-name>/`.

No npm token, no Chromatic account, no manual `gh-pages` branch — the workflow uses GitHub's built-in `id-token`/`pages` permissions, so there's nothing extra to configure beyond flipping that one settings toggle.

### Alternative: Chromatic

If you'd rather have visual regression testing alongside hosting, [Chromatic](https://www.chromatic.com/) is a one-command alternative:

```bash
pnpm dlx chromatic --project-token=<token>
```

This requires creating a free Chromatic project and grabbing its token first. It's a heavier setup than GitHub Pages for just hosting docs, but it adds automatic screenshot diffing on every push, catching visual regressions that functional tests wouldn't (a spacing shift, a broken hover state, a color that silently changed).

## Versioning notes

Because this is a component library, breaking changes have a wider blast radius than in an app — anyone importing `Button` is affected the moment they upgrade. A few practical rules:

- Adding a new optional prop or a new component → **minor**
- Changing a prop's default value, renaming a prop, or removing a component → **major**
- Fixing a bug that doesn't change the public API → **patch**

`pnpm version <patch|minor|major>` handles bumping `package.json` and creating the corresponding git tag in one step.
