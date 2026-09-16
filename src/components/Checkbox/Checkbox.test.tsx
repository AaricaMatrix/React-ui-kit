import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default and toggles on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('respects a controlled checked state and calls onChange', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox label="Subscribe" checked={false} onChange={handleChange} />);

    await user.click(screen.getByLabelText('Subscribe'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows an error message tied to the input via aria-describedby', () => {
    render(<Checkbox label="Accept terms" error="You must accept to continue" />);

    const checkbox = screen.getByLabelText('Accept terms');
    const error = screen.getByRole('alert');

    expect(error).toHaveTextContent('You must accept to continue');
    expect(checkbox).toHaveAttribute('aria-describedby', error.id);
  });
});
