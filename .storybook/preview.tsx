import type { Preview } from '@storybook/react-vite'
import aaruTheme from './aaruTheme'
import { CustomDocsPage } from './CustomDocsPage'
import '../src/styles/globals.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Light / dark theme for the component preview',
      toolbar: {
        icon: 'circlehollow',
        title: 'Theme',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      return (
        <div
          className={isDark ? 'dark' : ''}
          style={{
            minHeight: '100%',
            padding: '2.5rem',
            background: isDark
              ? 'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.12), transparent 65%), #14101f'
              : 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.06), transparent 65%), transparent',
            transition: 'background-color 0.2s ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],

  parameters: {
    layout: 'centered',

    options: {
      storySort: {
        order: [
          'Introduction',
          'Components',
          ['Button', 'TextInput', 'Checkbox', 'Select', 'Card', 'Badge', 'Modal', 'Tabs'],
        ],
      },
    },

    backgrounds: {
      default: 'canvas',
      options: {
        canvas: { name: 'Canvas', value: '#f5f3ff' },
        white: { name: 'White', value: '#ffffff' },
        dark: { name: 'Dark', value: '#171b40' },
      },
    },

    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },

    docs: {
      theme: aaruTheme,
      toc: true,
      page: CustomDocsPage,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
