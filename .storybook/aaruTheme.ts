import { create } from 'storybook/theming';

const shared = {
  brandTitle: '@aaru/ui-kit',
  brandUrl: 'https://github.com/AaricaMatrix/React-ui-kit',
  brandTarget: '_self',
  fontBase: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, monospace',
  appBorderRadius: 12,
  inputBorderRadius: 8,
};

export const aaruThemeLight = create({
  ...shared,
  base: 'light',

  colorPrimary: '#8b5cf6',
  colorSecondary: '#7c3aed',

  appBg: '#f6f4fd',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#ddd6fe',

  textColor: '#2e1065',
  textInverseColor: '#ffffff',
  textMutedColor: '#6d5a94',

  barTextColor: '#6d28d9',
  barSelectedColor: '#8b5cf6',
  barHoverColor: '#a78bfa',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#ddd6fe',
  inputTextColor: '#2e1065',
});

export const aaruThemeDark = create({
  ...shared,
  base: 'dark',

  colorPrimary: '#a78bfa',
  colorSecondary: '#8b5cf6',

  appBg: '#14101f',
  appContentBg: '#1b1530',
  appPreviewBg: '#201a38',
  appBorderColor: 'rgba(167, 139, 250, 0.18)',

  textColor: '#ede9fe',
  textInverseColor: '#2e1065',
  textMutedColor: '#b8a9dd',

  barTextColor: '#c4b5fd',
  barSelectedColor: '#a78bfa',
  barHoverColor: '#ddd6fe',
  barBg: '#1b1530',

  inputBg: '#201a38',
  inputBorder: 'rgba(167, 139, 250, 0.25)',
  inputTextColor: '#ede9fe',
});

// Default export kept for anything importing the old single-theme shape
// (e.g. docs pages, which don't auto-switch with the OS and read a static theme).
export default aaruThemeLight;
