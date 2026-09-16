import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Modal } from './Modal';
import type { ModalProps } from './Modal';

function ModalDemo(props: Omit<ModalProps, 'isOpen' | 'onClose'>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

const meta: Meta<typeof ModalDemo> = {
  title: 'Components/Modal',
  component: ModalDemo,
  tags: ['autodocs'],
  args: {
    title: 'Delete project',
    children: 'This action cannot be undone. Are you sure you want to continue?',
  },
};

export default meta;
type Story = StoryObj<typeof ModalDemo>;

export const Default: Story = {};

export const WithFooterActions: Story = {
  render: (args) => {
    function DemoWithFooter() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Delete project</Button>
          <Modal
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={() => setIsOpen(false)}>
                  Delete
                </Button>
              </>
            }
          />
        </>
      );
    }
    return <DemoWithFooter />;
  },
};

export const OpenAndCloseInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'));
    await expect(dialog).toBeVisible();

    await userEvent.click(within(document.body).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const EscapeClosesModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => within(document.body).getByRole('dialog'));

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
  },
};
