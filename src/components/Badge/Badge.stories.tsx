import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'danger', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { tone: 'neutral' } };
export const Brand: Story = { args: { tone: 'brand', children: 'New' } };
export const Success: Story = { args: { tone: 'success', children: 'Active' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Failed' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Pending' } };

export const AllTones: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="brand">Brand</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="warning">Warning</Badge>
    </div>
  ),
};
