import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Accept terms and conditions' },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithError: Story = {
  args: { error: 'You must accept the terms to continue' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ToggleInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByLabelText('Accept terms and conditions');
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};
