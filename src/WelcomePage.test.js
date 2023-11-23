import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import WelcomePage from './WelcomePage';

test('renders WelcomePage component', () => {
  render(
    <Router>
      <WelcomePage />
    </Router>
  );

  // Assuming your component has some unique text
  const welcomeText = screen.getByText(/Welcome to Innovature Bank/i);
  expect(welcomeText).toBeInTheDocument();

  // Test navigation links
  fireEvent.click(screen.getByText(/Login/i));
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Register/i));
  expect(screen.getByText(/register/i)).toBeInTheDocument();
  // Add additional fireEvent.click for other links

  // Check if the navigation works as expected
  // You can use react-router-dom's MemoryRouter to simulate navigation and check the rendered component
});
