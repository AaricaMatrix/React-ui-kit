import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'profile', label: 'Profile', content: 'Profile content' },
  { id: 'projects', label: 'Projects', content: 'Projects content' },
  { id: 'settings', label: 'Settings', content: 'Settings content', disabled: true },
];

describe('Tabs', () => {
  it('shows the first tab as selected by default', () => {
    render(<Tabs tabs={tabs} />);

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Profile content');
  });

  it('switches panels when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);

    await user.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Projects content');
  });

  it('navigates with the arrow keys and skips disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);

    const profileTab = screen.getByRole('tab', { name: 'Profile' });
    profileTab.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Projects' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();
  });

  it('calls onChange for controlled usage', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Tabs tabs={tabs} activeTabId="profile" onChange={handleChange} />);

    await user.click(screen.getByRole('tab', { name: 'Projects' }));
    expect(handleChange).toHaveBeenCalledWith('projects');
  });

  it('disables the disabled tab', () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeDisabled();
  });
});
