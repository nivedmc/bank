import React from 'react';
import { render, screen, fireEvent, act, waitFor, getByLabelText } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { customerService } from './apiurls';
import Transactionpage from './transactionpage';

jest.mock('./apiurls');
jest.mock('./UserContext', () => ({
  useUser: () => ({
    updatebalance: jest.fn(),
  }),
}));

describe('Transactionpage Component', () => {


  it.only('renders transaction form and performs a successful transaction', async () => {
    render(
      <Router>
        <Transactionpage />
      </Router>
    );

    await act(async () => {

      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } });

    });
  //   await act(async () => {
  //     const transactionTypeSelect = screen.getByLabelText('transactionType');
  //     fireEvent.change(transactionTypeSelect, { target: { value: 'deposit' } });
  // });

    screen.debug();

    // Mock the successful transaction response
    customerService.transaction.mockResolvedValueOnce({
      data: {
        // Your successful transaction response data goes here
        message: 'Transaction successful!',
      },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add money/i }));
    });

    // Check if the transaction function was called with the correct data
    await waitFor(() => {
      // Check if the transaction function was called with the correct data
      expect(customerService.transaction).toHaveBeenCalledWith({
        amount: '1000',
        transaction_type: 'deposit',
      });

      // Check if the success message is displayed
    });

  });
  it.only('renders transaction form and performs a successful withdrawal', async () => {
    render(
      <Router>
        <Transactionpage />
      </Router>
    );

    await act(async () => {

      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } });

    });
  //   await act(async () => {
  //     const transactionTypeSelect = screen.getByLabelText('transactionType');
  //     fireEvent.change(transactionTypeSelect, { target: { value: 'deposit' } });
  // });

    screen.debug();

    // Mock the successful transaction response
    customerService.transaction.mockResolvedValueOnce({
      data: {
        // Your successful transaction response data goes here
        message: 'Transaction successful!',
      },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));
    });

    // Check if the transaction function was called with the correct data
    await waitFor(() => {
      // Check if the transaction function was called with the correct data
      expect(customerService.transaction).toHaveBeenCalledWith({
        amount: '1000',
        transaction_type: 'withdrawal',
      });

      // Check if the success message is displayed
    });

  });
});
