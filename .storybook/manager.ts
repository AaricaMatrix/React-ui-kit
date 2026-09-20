import { addons } from 'storybook/manager-api';
import aaruTheme from './aaruTheme';

addons.setConfig({
  theme: aaruTheme,
  sidebar: {
    showRoots: false,
  },
});
