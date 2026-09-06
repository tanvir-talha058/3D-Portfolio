import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SoundProvider, useSound } from './SoundContext';

function SoundProbe() {
  const { soundEnabled, toggleSound } = useSound();
  return <button onClick={toggleSound}>{soundEnabled ? 'on' : 'off'}</button>;
}

describe('SoundContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles soundEnabled exactly once per click (no StrictMode double-toggle)', () => {
    render(
      <SoundProvider>
        <SoundProbe />
      </SoundProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('on');

    fireEvent.click(button);
    expect(button).toHaveTextContent('off');

    fireEvent.click(button);
    expect(button).toHaveTextContent('on');
  });
});
