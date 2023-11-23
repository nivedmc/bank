import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { customerService } from './apiurls';
import LoginPage from './login';

jest.mock('./apiurls', () => ({
  customerService: {
    login: jest.fn(),
  },
}));
jest.mock('./UserContext', () => ({
  useUser: () => ({
    updateUsername: jest.fn(),
    updatebalance: jest.fn(),
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form and performs login', async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Mock the successful login API call
    customerService.login.mockResolvedValueOnce({
      status: 200,
      data: { access: 'mocked-token', user_type: 'customer', id: 123,activity_status: true, balance: 100 },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Mocked Axios post request should have been called
    expect(customerService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(localStorage.getItem('token')).toBe('mocked-token');
    expect(localStorage.getItem('id')).toBe('123');
    expect(localStorage.getItem('usertype')).toBe('customer');
    expect(window.location.pathname).toBe('/customerhome');
  });

  it('renders login form and performs inactive customer login', async () => {
    const mockSetInactivetoast = jest.fn();
    render(
      <Router>
        <LoginPage setinactivetoast={mockSetInactivetoast} />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser1' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Mock the successful login API call
    customerService.login.mockResolvedValueOnce({
      status: 200,
      data: { access: 'mocked-token', user_type: 'customer', id: 1233,activity_status: false, balance: 100 },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Mocked Axios post request should have been called
    expect(customerService.login).toHaveBeenCalledWith({
      username: 'testuser1',
      password: 'testpassword',
    });

  });

  it('renders login form and handles login failure', async () => {
    // Mocking the login function to simulate a failure
    customerService.login.mockRejectedValueOnce(new Error('Login failure'));

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invaliduser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'invalidpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Check if the error message is displayed
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByText('please enter a valid username and password')).toBeInTheDocument();
  });
  it('renders login form and handles login failure', async () => {
    // Mocking the login function to simulate a failure
    customerService.login.mockRejectedValueOnce(new Error('Login failure'));

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });
  });

  it('renders login form and performs login', async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'teststaff' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Mock the successful login API call
    customerService.login.mockResolvedValueOnce({
      status: 200,
      data: { access: 'mocked-token', user_type: 'staff', id: 223 },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Mocked Axios post request should have been called
    expect(customerService.login).toHaveBeenCalledWith({
      username: 'teststaff',
      password: 'testpassword',
    });

    // After successful login, it should navigate to the expected page
    // Adjust this expectation based on your actual navigation logic
    expect(window.location.pathname).toBe('/customerList');
  });

  it('renders login form and performs login', async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testmanager' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Mock the successful login API call
    customerService.login.mockResolvedValueOnce({
      status: 200,
      data: { access: 'mocked-token', id: 323 },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Mocked Axios post request should have been called
    expect(customerService.login).toHaveBeenCalledWith({
      username: 'testmanager',
      password: 'testpassword',
    });

    // After successful login, it should navigate to the expected page
    // Adjust this expectation based on your actual navigation logic
    expect(window.location.pathname).toBe('/Stafflist');
  });
  jest.mock('./apiurls', () => ({
    customerService: {
      login: jest.fn(() => Promise.reject(new Error('Invalid credentials'))),
    },
  }));
  it('displays error toast for invalid credentials', async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Enter invalid credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invaliduser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    // Trigger the form submission
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Wait for the asynchronous code to complete
    await waitFor(() => {
      // Assert that the error toast is displayed
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(screen.getByText('please enter a valid username and password')).toBeInTheDocument();
    });
  });

});
