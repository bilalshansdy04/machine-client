import { render, screen } from '@testing-library/react';
import RecordTable from '../components/dashboard-component/RecordTable';

test('renders Records Table with subtitle', () => {
    render(<RecordTable />);
    const subtitleElement = screen.getByText(/Records Table/i); // sesuaikan dengan subtitle yang Anda gunakan
    expect(subtitleElement).toBeInTheDocument();
});
