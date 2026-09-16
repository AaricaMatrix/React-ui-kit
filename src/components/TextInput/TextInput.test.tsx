import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('associates the label with the input', () => {
    render(<TextInput label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('lets the user type into the field', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Email address" />);

    const input = screen.getByLabelText('Email address');
    await user.type(input, 'aaru@example.com');

    expect(input).toHaveValue('aaru@example.com');
  });

  it('shows helper text when there is no error', () => {
    render(<TextInput label="Username" helperText="Must be unique" />);
    expect(screen.getByText('Must be unique')).toBeInTheDocument();
  });

  it('shows an error message and marks the field invalid', () => {
    render(<TextInput label="Email address" error="Enter a valid email" helperText="ignored" />);

    const input = screen.getByLabelText('Email address');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });

  it('marks required fields with an asterisk', () => {
    render(<TextInput label="Full name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toBeRequired();
  });
});
