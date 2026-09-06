import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectModal from './ProjectModal';

const sampleProject = {
  id: 'test-project',
  title: 'Test Project Title',
  badge: 'Test Category',
  summary: 'A short summary of the test project.',
  tech: ['React', 'Node'],
  highlights: ['Did a thing', 'Did another thing']
};

describe('ProjectModal', () => {
  it('renders nothing when no project is selected', () => {
    const { container } = render(<ProjectModal project={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the project title and calls onClose from the close button', () => {
    const onClose = vi.fn();
    render(<ProjectModal project={sampleProject} onClose={onClose} />);

    expect(screen.getByText('Test Project Title')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
