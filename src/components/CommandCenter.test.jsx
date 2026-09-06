import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandCenter from './CommandCenter';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SoundProvider } from '../contexts/SoundContext';

function renderCommandCenter(props = {}) {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onOpenRecruiter: vi.fn(),
    onOpenResume: vi.fn(),
    toggleTheme: vi.fn(),
    onTriggerInference: vi.fn()
  };
  const merged = { ...defaults, ...props };
  render(
    <ThemeProvider>
      <SoundProvider>
        <CommandCenter {...merged} />
      </SoundProvider>
    </ThemeProvider>
  );
  return merged;
}

describe('CommandCenter', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ThemeProvider>
        <SoundProvider>
          <CommandCenter
            isOpen={false}
            onClose={vi.fn()}
            onOpenRecruiter={vi.fn()}
            onOpenResume={vi.fn()}
            toggleTheme={vi.fn()}
            onTriggerInference={vi.fn()}
          />
        </SoundProvider>
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists every command and narrows them as the query changes', () => {
    renderCommandCenter();

    const allOptions = screen.getAllByRole('option');
    expect(allOptions.length).toBeGreaterThan(1);

    const input = screen.getByRole('combobox', { name: 'Search commands' });
    fireEvent.change(input, { target: { value: 'vitae' } });

    const filtered = screen.getAllByRole('option');
    expect(filtered.length).toBeLessThan(allOptions.length);
    expect(filtered[0]).toHaveTextContent(/Curriculum Vitae/i);
  });

  it('executes the selected command and closes on Enter', () => {
    const onOpenResume = vi.fn();
    const onClose = vi.fn();
    renderCommandCenter({ onOpenResume, onClose });

    const input = screen.getByRole('combobox', { name: 'Search commands' });
    fireEvent.change(input, { target: { value: 'vitae' } });
    // The Enter/Arrow key handler is bound to the dialog element itself.
    fireEvent.keyDown(input.closest('dialog'), { key: 'Enter' });

    expect(onOpenResume).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });

  it('moves the selection with arrow keys', () => {
    renderCommandCenter();

    const dialog = screen.getByRole('combobox', { name: 'Search commands' }).closest('dialog');
    const options = screen.getAllByRole('option');
    const firstId = options[0].id;
    const secondId = options[1].id;

    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(dialog, { key: 'ArrowDown' });
    expect(document.getElementById(secondId)).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById(firstId)).toHaveAttribute('aria-selected', 'false');

    fireEvent.keyDown(dialog, { key: 'ArrowUp' });
    expect(document.getElementById(firstId)).toHaveAttribute('aria-selected', 'true');
  });
});
