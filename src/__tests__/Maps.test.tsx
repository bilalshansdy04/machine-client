import { render, screen } from '@testing-library/react';
import Maps from '../components/dashboard-component/Maps';

test('renders Maps component with subtitle', () => {
    render(<Maps />);
    const subtitleElement = screen.getByText(/Machine Locations on Map/i);
    expect(subtitleElement).toBeInTheDocument();
});
