import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function ThemeProbe() {
  const { isLightMode, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{isLightMode ? 'light' : 'dark'}</button>;
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('defaults to dark mode and toggles to light on click', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('dark');

    fireEvent.click(button);
    expect(button).toHaveTextContent('light');
    expect(document.body.classList.contains('light-mode')).toBe(true);
    expect(localStorage.getItem('portfolio_theme')).toBe('light');
  });
});
