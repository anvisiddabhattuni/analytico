import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Analytico landing page', async () => {
  render(<App />);
  const brand = await screen.findAllByText(/analytico/i);
  expect(brand.length).toBeGreaterThan(0);
});
