import { create } from 'storybook/theming';

export default create({
  base: 'light',

  brandTitle: '@aaru/ui-kit',
  brandUrl: 'https://github.com/AaricaMatrix/React-ui-kit',
  brandTarget: '_self',

  // Brand palette, matches tailwind.config.js `brand` (lavender/violet)
  colorPrimary: '#8b5cf6',
  colorSecondary: '#7c3aed',

  // UI
  appBg: '#f5f3ff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#ddd6fe',
  appBorderRadius: 10,

  // Typography
  fontBase: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  fontCode: '"Fira Code", "SFMono-Regular", Consolas, monospace',

  // Text colors
  textColor: '#4c1d95',
  textInverseColor: '#ffffff',
  textMutedColor: '#7c3aed',

  // Toolbar
  barTextColor: '#6d28d9',
  barSelectedColor: '#8b5cf6',
  barHoverColor: '#a78bfa',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#ddd6fe',
  inputTextColor: '#4c1d95',
  inputBorderRadius: 8,
});
