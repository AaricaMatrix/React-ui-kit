import { addons } from 'storybook/manager-api';
import { aaruThemeLight, aaruThemeDark } from './aaruTheme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(isDark: boolean) {
  addons.setConfig({
    theme: isDark ? aaruThemeDark : aaruThemeLight,
    sidebar: {
      showRoots: false,
    },
  });
}

applyTheme(prefersDark.matches);

// Live-update if the OS theme changes while Storybook is open, so the
// manager shell's colors stay in sync with the CSS in manager-head.html,
// which uses the same `prefers-color-scheme` media query.
prefersDark.addEventListener('change', (event) => applyTheme(event.matches));
