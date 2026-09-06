import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';

describe('Contact form', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true });
  });

  it('does not submit when required fields are empty', () => {
    const onToast = vi.fn();
    render(<Contact onToast={onToast} />);

    fireEvent.submit(screen.getByRole('button', { name: /send transmission/i }).closest('form'));

    expect(window.fetch).not.toHaveBeenCalled();
    expect(onToast).not.toHaveBeenCalled();
  });

  it('shows a "not configured" message instead of silently faking success when no Formspree ID is set', () => {
    const onToast = vi.fn();
    render(<Contact onToast={onToast} />);

    fireEvent.change(screen.getByPlaceholderText(/alex henderson/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText(/alex@company.com/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/tell me about your project/i), {
      target: { value: 'Hello!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send transmission/i }));

    expect(window.fetch).not.toHaveBeenCalled();
    expect(onToast).toHaveBeenCalledWith(
      expect.stringContaining("isn't configured"),
      expect.any(String)
    );
  });
});
