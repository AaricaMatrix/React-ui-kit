import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'ml', label: 'Machine Learning' },
  { value: 'web', label: 'Web Development' },
  { value: 'data', label: 'Data Analytics' },
];

describe('Select', () => {
  it('renders all options plus a placeholder', () => {
    render(<Select label="Track" options={options} placeholder="Choose a track" />);

    const select = screen.getByLabelText('Track');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Choose a track' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Machine Learning' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('lets the user pick an option', async () => {
    const user = userEvent.setup();
    render(<Select label="Track" options={options} placeholder="Choose a track" />);

    const select = screen.getByLabelText('Track');
    await user.selectOptions(select, 'web');

    expect(select).toHaveValue('web');
  });

  it('disables options marked as disabled', () => {
    render(
      <Select
        label="Track"
        options={[...options, { value: 'full', label: 'Full', disabled: true }]}
      />,
    );

    expect(screen.getByRole('option', { name: 'Full' })).toBeDisabled();
  });

  it('shows an error message and marks the field invalid', () => {
    render(<Select label="Track" options={options} error="Pick a track" />);

    const select = screen.getByLabelText('Track');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a track');
  });
});
