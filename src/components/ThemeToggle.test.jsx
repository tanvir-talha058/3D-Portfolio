import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('shows a moon and "Switch to Light Mode" label in dark mode', () => {
    render(<ThemeToggle isLightMode={false} onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Switch to Light Mode' });
    expect(button).toBeInTheDocument();
  });

  it('shows a sun and "Switch to Dark Mode" label in light mode', () => {
    render(<ThemeToggle isLightMode={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Switch to Dark Mode' })).toBeInTheDocument();
  });

  it('calls onToggle exactly once per click', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle isLightMode={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
