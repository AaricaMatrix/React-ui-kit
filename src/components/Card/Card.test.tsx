import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Some content</Card>);
    expect(screen.getByText('Some content')).toBeInTheDocument();
  });

  it('renders a title and subtitle when provided', () => {
    render(
      <Card title="Project stats" subtitle="Last updated today">
        Body
      </Card>,
    );

    expect(screen.getByRole('heading', { name: 'Project stats' })).toBeInTheDocument();
    expect(screen.getByText('Last updated today')).toBeInTheDocument();
  });

  it('omits the header block when no title or subtitle is given', () => {
    render(<Card>Body only</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders a footer when provided', () => {
    render(<Card footer={<button type="button">Confirm</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });
});
