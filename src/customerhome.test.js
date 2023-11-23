import React from 'react';
import { render,screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
// import fetchMock from 'jest-fetch-mock';
import CustomerDashboard from './customerhome';


jest.mock('./UserContext', () => ({
  useUser: () => ({
    updatebalance: jest.fn(),
  }),
}));
describe('CustomerDashboard', () => {
  it('sign out button', async () => {
    render(
      <Router>
        <CustomerDashboard />
      </Router>        
    );
    fireEvent.click(screen.getByText('Sign Out'));
    expect(window.location.pathname).toBe('/login');
  // Add assertions based on the expected behavior after signing out
});
it('make transactions button', async () => {
  render(
    <Router>
      <CustomerDashboard />
    </Router>        
  );
  fireEvent.click(screen.getByText('make a Transaction'));
  expect(window.location.pathname).toBe('/transactionpage');
// Add assertions based on the expected behavior after signing out
});
// fetchMock.enableMocks();
// it('downloads transactions successfully', async () => {
//   // Mock localStorage getItem
//   jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('mocked-token');

//   // Mock the fetch response
//   fetchMock.mockResponseOnce(new Blob(['CSV data'], { type: 'text/csv' }));

//   // Render your component or call the function that uses downloadtransactions
//   // For example, if it's part of a React component, you can render the component

//   // Act: Call the downloadtransactions function
//   await act(async () => {
//     await downloadtransactions();
//   });

//   // Assert: Check if the necessary fetch call was made
//   expect(fetchMock.mock.calls.length).toBe(1);
//   expect(fetchMock.mock.calls[0][0]).toBe('http://127.0.0.1:8000/api/export-transactions/');
//   expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer mocked-token');

//   // Add more assertions as needed based on your actual implementation
// });

});