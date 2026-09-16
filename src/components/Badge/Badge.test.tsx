import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies tone-specific classes', () => {
    render(<Badge tone="danger">Failed</Badge>);
    expect(screen.getByText('Failed').className).toContain('text-danger-600');
  });

  it('defaults to the neutral tone', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-gray-100');
  });
});
