import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('renders nothing when there are no toasts', () => {
    const { container } = render(<Toast toasts={[]} />);
    // The status container itself still renders (for aria-live), just empty.
    expect(container.querySelectorAll('.glass-card').length).toBe(0);
  });

  it('renders a message and announces it via role="status"', () => {
    render(<Toast toasts={[{ id: '1', message: 'Hello there', icon: 'Mail' }]} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Hello there');
  });

  it('applies the exit animation class set once a toast is flagged exiting', () => {
    render(<Toast toasts={[{ id: '1', message: 'Bye', icon: 'Send', exiting: true }]} />);
    const card = screen.getByText('Bye').closest('.glass-card');
    expect(card.style.animation).toContain('slideOutToast');
  });

  it('renders multiple toasts independently', () => {
    render(
      <Toast
        toasts={[
          { id: '1', message: 'First', icon: 'Mail' },
          { id: '2', message: 'Second', icon: 'BookOpen' }
        ]}
      />
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
