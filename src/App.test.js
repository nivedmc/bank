import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders App component', () => {
  render(
 
      <App />

  );

  // Assuming your WelcomePage component has some unique text
  const welcomeText = screen.getByText(/Welcome to Innovature Bank/i);
  expect(welcomeText).toBeInTheDocument();
});