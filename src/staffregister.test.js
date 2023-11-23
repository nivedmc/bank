import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StaffRegisterPage from './staffregister';
import { customerService } from './apiurls';

jest.mock('./apiurls', () => ({
  customerService: {
    register: jest.fn(),
  },
}));

describe('StaffRegisterPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders staff registration form and performs registration', async () => {
    render(
      <Router>
        <StaffRegisterPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'teststaff' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teststaff@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile No/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    // Mocked customerService.register function should have been called
    expect(customerService.register).toHaveBeenCalledWith({
      username: 'teststaff',
      email: 'teststaff@example.com',
      mobile_no: '9876543210',
      date_of_birth: '2023-01-01',
      user_type: 'staff',
      password: 'testpassword',
    });

    // After successful registration, it should navigate to the Stafflist page
    // Adjust this expectation based on your actual navigation logic
    expect(window.location.pathname).toBe('/Stafflist');
  });
  it('renders registration form and handles registration failure', async () => {
    // Mocking the register function to simulate a failure
    customerService.register.mockRejectedValueOnce(new Error('Registration failure'));

    render(
      <Router>
        <StaffRegisterPage />
      </Router>
    );

    // Fill in the form fields
    // (Assuming you have proper labels for your form fields)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'teststaff' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teststaff@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile No/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    // Check if the error message is displayed
    // expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });


  // Add more test cases as needed, such as handling registration failure, form validation, etc.
});

