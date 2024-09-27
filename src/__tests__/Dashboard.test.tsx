import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard.tsx';

test('renders Dashboard component', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/Dashboard/i);
    expect(titleElement).toBeInTheDocument();
});
