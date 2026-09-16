import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Card title',
    subtitle: 'A short supporting line',
    children: 'This is the card body content. Put anything here.',
  },
  render: (args) => (
    <div className="w-80">
      <Card {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const WithFooter: Story = {
  args: {
    footer: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </div>
    ),
  },
};

export const BodyOnly: Story = {
  args: { title: undefined, subtitle: undefined },
};

export const NoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <img
        src="https://placehold.co/320x160"
        alt="Placeholder"
        className="block w-full"
      />
    ),
  },
};
