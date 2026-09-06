import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Skills from './Skills';

describe('Skills filter', () => {
  it('narrows the visible skill cards when a category filter is selected', () => {
    render(<Skills />);

    const allCount = screen.getAllByRole('heading', { level: 3 }).length;
    expect(allCount).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Computer Vision & Media/i }));
    const filteredCount = screen.getAllByRole('heading', { level: 3 }).length;
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(allCount);

    fireEvent.click(screen.getByRole('button', { name: /All Technologies/i }));
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(allCount);
  });
});
