import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UpdateProfile from './updateprofile';
import { customerService } from './apiurls';

jest.mock('./apiurls', () => ({
  customerService: {
    userdetails: jest.fn(() => Promise.resolve({ data: { username: 'testuser', first_name: 'Test', last_name: 'User', email: 'test@example.com' } })),
    updateprofile: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('UpdateProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders update profile form and performs update', async () => {
    render(
      <Router>
        <UpdateProfile />
      </Router>
    );

    // Wait for user details to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toHaveValue('');
      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });

    // Update form fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'UserUpdated' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update profile/i }));

    // Wait for the update to complete
    await waitFor(() => {
      expect(customerService.updateprofile).toHaveBeenCalledWith(
        localStorage.getItem('id'),
        {
          username: '',
          first_name: 'Updated',
          last_name: 'UserUpdated',
          email: '',
        }
      );
    });
    expect(window.location.pathname).toBe('/login');


  });

  it('renders update profile form and performs update', async () => {
    const mockcustomer =
      {
        first_name: "",
        last_name: "",
        username: "",
        email: "cust@gmail.com",
        mob_no: "6089124417"
    };
    customerService.userdetails.mockResolvedValueOnce({ data:mockcustomer });


    render(
      <Router>
        <UpdateProfile />
      </Router>
    );


    customerService.userdetails.mockResolvedValueOnce({ data:mockcustomer });
    // Wait for user details to be loaded

    
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toHaveValue(mockcustomer.username);
      expect(screen.getByLabelText(/first name/i)).toHaveValue(mockcustomer.first_name);
      expect(screen.getByLabelText(/last name/i)).toHaveValue(mockcustomer.last_name);
      expect(screen.getByLabelText(/email/i)).toHaveValue(mockcustomer.email);
    });

    // Update form fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'UserUpdated' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update profile/i }));

    // Wait for the update to complete
    await waitFor(() => {
      expect(customerService.updateprofile).toHaveBeenCalledWith(
        localStorage.getItem('id'),
        {
          username: '',
          first_name: 'Updated',
          last_name: 'UserUpdated',
          email: 'cust@gmail.com',
        }
      );
    });
    expect(window.location.pathname).toBe('/login');


  });


});
