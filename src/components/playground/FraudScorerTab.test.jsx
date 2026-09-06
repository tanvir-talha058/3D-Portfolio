import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SoundProvider } from '../../contexts/SoundContext';
import FraudScorerTab from './FraudScorerTab';

function renderTab() {
  return render(
    <SoundProvider>
      <FraudScorerTab />
    </SoundProvider>
  );
}

describe('FraudScorerTab', () => {
  it('shows a placeholder until a risk score is evaluated', () => {
    renderTab();
    expect(screen.getByText(/adjust parameters/i)).toBeInTheDocument();
  });

  it('computes a CRITICAL verdict for the risky default inputs', async () => {
    renderTab();

    fireEvent.click(screen.getByRole('button', { name: /evaluate anomaly risk score/i }));

    await waitFor(() => expect(screen.getByText(/VERDICT:/)).toBeInTheDocument(), {
      timeout: 2000
    });
    expect(screen.getByText(/CRITICAL \/ BLOCKED/)).toBeInTheDocument();
  });

  it('computes a LEGITIMATE verdict for low-risk inputs', async () => {
    renderTab();

    // Sliders aren't individually labeled; select by DOM order (amount, then velocity).
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '1000' } });
    fireEvent.change(sliders[1], { target: { value: '1' } });
    fireEvent.click(screen.getByLabelText(/unrecognized device/i));

    fireEvent.click(screen.getByRole('button', { name: /evaluate anomaly risk score/i }));

    await waitFor(() => expect(screen.getByText(/VERDICT:/)).toBeInTheDocument(), {
      timeout: 2000
    });
    expect(screen.getByText(/LEGITIMATE \/ ALLOWED/)).toBeInTheDocument();
  });
});
