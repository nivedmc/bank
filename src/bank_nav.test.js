import React from 'react';
import { render, screen, fireEvent ,act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BankNavbar from './bank_nav';

// Mock the useNavigate hook

describe('BankNavbar component', () => {
  // Clear all mocks before each test



  it('renders BankNavbar correctly', async()  => {
    render(
      <Router>
        <BankNavbar />
      </Router>
    );

    // Check if the navbar brand is rendered
    expect(screen.getByText('Innovature Bank')).toBeInTheDocument();

    // Check if the "Home" and "update_profile" links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('update_profile')).toBeInTheDocument();

    // Check if the "Sign Out" button is rendered
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls navigate on Sign Out button click', async() => {
    render(
      <Router>
        <BankNavbar />
      </Router>
    );

    // Mock the navigate function
    // const mockNavigate = jest.fn();
    // // require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    await act(async () => {
      fireEvent.click(screen.getByText('Sign Out'));
    });

    // fireEvent.click(screen.getByText('Sign Out'));

    // Check if the navigate function is called with the correct argument
    expect(window.location.pathname).toBe('/login');
  });
});
