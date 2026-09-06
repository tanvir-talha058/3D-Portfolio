import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SoundProvider } from '../contexts/SoundContext';

function renderNavbar(props = {}) {
  return render(
    <ThemeProvider>
      <SoundProvider>
        <Navbar
          onOpenRecruiter={vi.fn()}
          onOpenResume={vi.fn()}
          onOpenCommandCenter={vi.fn()}
          onToggleTheme={vi.fn()}
          {...props}
        />
      </SoundProvider>
    </ThemeProvider>
  );
}

describe('Navbar mobile menu', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('opens and closes via the toggle button, updating aria-expanded', () => {
    renderNavbar();

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-menu')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    expect(document.getElementById('mobile-menu')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
  });

  it('runs the Recruiter Cheat Sheet action and closes the menu when clicked inside the drawer', () => {
    const onOpenRecruiter = vi.fn();
    renderNavbar({ onOpenRecruiter });

    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    fireEvent.click(screen.getByRole('button', { name: /Recruiter Cheat Sheet/i }));

    expect(onOpenRecruiter).toHaveBeenCalledTimes(1);
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
  });
});
