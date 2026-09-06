import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render } from '@testing-library/react';
import NeuralBackground from './NeuralBackground';
import { ThemeProvider } from '../contexts/ThemeContext';

const noop2dContext = {
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  stroke: () => {},
  moveTo: () => {},
  lineTo: () => {},
  clearRect: () => {},
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1
};

describe('NeuralBackground', () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(noop2dContext);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('mounts and unmounts without throwing, cleaning up its listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ThemeProvider>
        <NeuralBackground />
      </ThemeProvider>
    );

    const addedTypes = addSpy.mock.calls.map((call) => call[0]);
    expect(addedTypes).toEqual(expect.arrayContaining(['resize', 'mousemove', 'click']));

    expect(() => unmount()).not.toThrow();

    const removedTypes = removeSpy.mock.calls.map((call) => call[0]);
    for (const type of ['resize', 'mousemove', 'mouseleave', 'click']) {
      expect(removedTypes).toContain(type);
    }
  });

  it('fires onEasterEgg after ten clicks', () => {
    const onEasterEgg = vi.fn();
    render(
      <ThemeProvider>
        <NeuralBackground onEasterEgg={onEasterEgg} />
      </ThemeProvider>
    );

    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new MouseEvent('click', { clientX: 10, clientY: 10 }));
    }

    expect(onEasterEgg).toHaveBeenCalledTimes(1);
  });
});
