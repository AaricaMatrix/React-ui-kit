import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'profile', label: 'Profile', content: 'Profile settings go here.' },
  { id: 'security', label: 'Security', content: 'Password and 2FA settings go here.' },
  { id: 'billing', label: 'Billing', content: 'Plan and invoices go here.', disabled: true },
];

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { tabs },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const DefaultTabSelected: Story = {
  args: { defaultTabId: 'security' },
};

export const ClickToSwitch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Security' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Password and 2FA');
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profileTab = canvas.getByRole('tab', { name: 'Profile' });
    profileTab.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Security' })).toHaveFocus();
  },
};
