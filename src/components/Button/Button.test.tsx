import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows a spinner and blocks clicks while loading', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies the requested variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('bg-danger-500');
    expect(button.className).toContain('text-base');
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
