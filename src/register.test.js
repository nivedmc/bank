import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { customerService } from './apiurls';
// import {expect, jest, test} from '@jest/globals';
import RegisterPage from './register';

jest.mock('./apiurls', () => ({
    customerService: {
      register: jest.fn(), 
    },
  }));

  describe('Signup Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

// describe('RegisterPage component', () => {
  it('renders registration form and performs registration', async () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile No/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    // Mocked Axios post request should have been called
    expect(customerService.register).toHaveBeenCalledWith(
// Replace with your actual registration API URL
      {
        username: 'testuser',
        email: 'test@example.com',
        mobile_no: '9876543210',
        date_of_birth: '2023-01-01',
        user_type: 'customer',
        password: 'testpassword',
      }
    );

    // After successful registration, it should navigate to the login page
    // Adjust this expectation based on your actual navigation logic
    expect(window.location.pathname).toBe('/login');
  });

  it('renders registration form and handles registration failure', async () => {
    // Mocking the register function to simulate a failure
    customerService.register.mockRejectedValueOnce(new Error('Registration failure'));

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    // Fill in the form fields
    // (Assuming you have proper labels for your form fields)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile no/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2020-01-01' } });
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    // Check if the error message is displayed
    // expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

});

