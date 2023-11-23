import React from 'react';
import { render } from '@testing-library/react';
import AppRoutes from './Routes';

test('renders AppRoutes without crashing', () => {
  render(<AppRoutes />);
  // Add more assertions as needed
});
