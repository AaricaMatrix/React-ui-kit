import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: "We'll never share your email." },
};

export const WithError: Story = {
  args: { error: 'Enter a valid email address', defaultValue: 'not-an-email' },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked@example.com' },
};

export const TypingInteraction: Story = {
  args: { label: 'Your name', placeholder: 'Jane Doe' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Your name');
    await userEvent.type(input, 'Aaru');
    await expect(input).toHaveValue('Aaru');
  },
};
