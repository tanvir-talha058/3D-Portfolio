import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Reveal from './Reveal';

const originalMatchMedia = window.matchMedia;

function mockReducedMotion(matches) {
  window.matchMedia = (query) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

describe('Reveal', () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders its children', () => {
    render(<Reveal>Hello</Reveal>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders already visible when IntersectionObserver is unavailable (jsdom)', () => {
    mockReducedMotion(false);
    render(<Reveal data-testid="reveal">Content</Reveal>);

    const el = screen.getByTestId('reveal');
    expect(el.style.opacity).toBe('1');
    expect(el.style.transform).toBe('none');
  });

  it('skips the animated styles entirely under prefers-reduced-motion', () => {
    mockReducedMotion(true);
    render(<Reveal data-testid="reveal">Content</Reveal>);

    const el = screen.getByTestId('reveal');
    expect(el.style.opacity).toBe('');
    expect(el.style.transition).toBe('');
  });

  it('renders as the given element type via the `as` prop', () => {
    mockReducedMotion(false);
    render(
      <Reveal as="span" data-testid="reveal-span">
        Span content
      </Reveal>
    );
    expect(screen.getByTestId('reveal-span').tagName).toBe('SPAN');
  });
});
