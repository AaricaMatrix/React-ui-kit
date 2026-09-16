import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Hidden">
        Body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and content when open', () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Delete item">
        Are you sure?
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay is clicked but not when the dialog itself is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    await user.click(screen.getByText('Are you sure?'));
    expect(handleClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within the dialog on Tab', async () => {
    const user = userEvent.setup();
    render(
      <Modal
        isOpen
        onClose={jest.fn()}
        title="Confirm"
        footer={
          <>
            <button type="button">Cancel</button>
            <button type="button">Confirm</button>
          </>
        }
      >
        Body
      </Modal>,
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    const confirmButton = screen.getByRole('button', { name: 'Confirm' });

    confirmButton.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeButton);
  });
});
