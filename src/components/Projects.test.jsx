import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Projects from './Projects';

describe('Projects filter', () => {
  it('narrows the visible project cards when a category filter is selected', () => {
    render(<Projects onSelectProject={() => {}} />);

    const allCount = screen.getAllByRole('button', { name: /deep dive/i }).length;
    expect(allCount).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /^Computer Vision/i }));
    const filteredCount = screen.getAllByRole('button', { name: /deep dive/i }).length;
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(allCount);

    fireEvent.click(screen.getByRole('button', { name: /^All/i }));
    expect(screen.getAllByRole('button', { name: /deep dive/i }).length).toBe(allCount);
  });

  it('reflects the active filter via aria-pressed', () => {
    render(<Projects onSelectProject={() => {}} />);

    const allBtn = screen.getByRole('button', { name: /^All/i });
    const cvBtn = screen.getByRole('button', { name: /^Computer Vision/i });

    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(cvBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(cvBtn);
    expect(cvBtn).toHaveAttribute('aria-pressed', 'true');
    expect(allBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
