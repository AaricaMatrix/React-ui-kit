import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';

const options = [
  { value: 'bca', label: 'BCA' },
  { value: 'btech', label: 'B.Tech' },
  { value: 'mca', label: 'MCA', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Degree',
    options,
    placeholder: 'Choose a degree',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'This appears on your public profile' },
};

export const WithError: Story = {
  args: { error: 'Please choose a degree' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const SelectInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText('Degree');
    await userEvent.selectOptions(select, 'btech');
    await expect(select).toHaveValue('btech');
  },
};
