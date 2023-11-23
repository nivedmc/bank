import React from 'react';
import { render, screen, waitFor,fireEvent, act } from '@testing-library/react';
import Stafflist from './Stafflist';
import { BrowserRouter as Router } from 'react-router-dom';

import { managerService } from './apiurls';

// jest.mock('./apiurls', () => ({
//   managerService: {
//     Staffmanagment: jest.fn(),
//     removestaff: jest.fn(),
//   },
// }));
jest.mock('./apiurls');

describe('Stafflist Component', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });

  it('renders staff list and removes a staff member', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
    // Mocking the API response
    const mockstaff ={
      results: [
        {
          id: 1,
          username: 'JohnDoe',
          email: 'john.doe@example.com',
          mobile_no: '1234567890',
          date_joined: '2023-01-01',
        },
        // Add more staff members if needed
        // {
        //   id: 2,
        //   username: 'John',
        //   email: 'john@example.com',
        //   mobile_no: '1234561890',
        //   date_joined: '2023-01-01',
        // },
      ],

    }
    // managerService.Staffmanagment.mockResolvedValueOnce({
    //   data: {
    //     results: [
    //       {
    //         id: 1,
    //         username: 'JohnDoe',
    //         email: 'john.doe@example.com',
    //         mobile_no: '1234567890',
    //         date_joined: '2023-01-01',
    //       },
    //       // Add more staff members if needed
    //       // {
    //       //   id: 2,
    //       //   username: 'John',
    //       //   email: 'john@example.com',
    //       //   mobile_no: '1234561890',
    //       //   date_joined: '2023-02-01',
    //       // },
    //     ],
    //   },
    // });
    managerService.Staffmanagment.mockResolvedValueOnce({ data:mockstaff });

    render(
      <Router>
        <Stafflist />
      </Router>
    );

    // Ensure the staff list is rendered
    expect(screen.getByText('Staff Managment')).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('JohnDoe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      // fireEvent.click(screen.getByText('remove'));

    })


    await act(async () => {
      fireEvent.click(screen.getByText('remove'));
    });

    // Ensure that the removestaff API was called with the correct ID
    expect(managerService.removestaff).toHaveBeenCalledWith(1);

    // Ensure that the staff member is removed from the list
    expect(screen.queryByText('JohnDoe')).not.toBeInTheDocument();
  });

  it('renders staff list and adds a staff member', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
    // Mocking the API response
    managerService.Staffmanagment.mockResolvedValueOnce({
      data: {
        results: [],
      },
    });

    // Render the component
    render(
      <Router>
        <Stafflist />
      </Router>
    );

    // Ensure the staff list is rendered
    expect(screen.getByText('Staff Managment')).toBeInTheDocument();

    // // Mocking the API response for adding a staff member
    // managerService.removestaff.mockResolvedValueOnce('1');

    // Click the "+add a staff" button
    fireEvent.click(screen.getByText('+add a staff'));

    // Ensure that the navigation occurred (you might need to adjust based on your actual navigation logic)
    // In this example, we expect that the '/staffregister' route is navigated to
    expect(window.location.pathname).toBe('/staffregister');
  });
  it('renders staff list and removes a staff member', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
    // Mocking the API response
    managerService.Staffmanagment.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            mobile_no: '1234567890',
            date_joined: '2023-01-01',
          }
          // Add more staff members if needed
          // {
          //   id: 2,
          //   username: 'John',
          //   email: 'john@example.com',
          //   mobile_no: '1234561890',
          //   date_joined: '2023-02-01',
          // },
        ],
      },
    });
    render(
      <Router>
        <Stafflist />
      </Router>
    );

    // Ensure the staff list is rendered
    expect(screen.getByText('Staff Managment')).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('JohnDoe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();

      // expect(screen.getByText('2')).toBeInTheDocument();
      // expect(screen.getByText('John')).toBeInTheDocument();
      // expect(screen.getByText('john@example.com')).toBeInTheDocument();
      // expect(screen.getByText('1234561890')).toBeInTheDocument();
      // expect(screen.getByText('2023-02-01')).toBeInTheDocument();
      // fireEvent.click(screen.getByText('remove'));
    
    })
    await act(async () => {
      fireEvent.click(screen.getByText('remove'));
    });

    // Ensure that the removestaff API was called with the correct ID
    expect(managerService.removestaff).toHaveBeenCalledWith(1);

    // Ensure that the staff member is removed from the list
    expect(screen.queryByText('JohnDoe')).not.toBeInTheDocument();



});

it('handles removal when token is not available', async () => {
  // Mock localStorage.getItem to return null, simulating the absence of a token
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

  managerService.Staffmanagment.mockResolvedValueOnce({
    data: {
      results: [
        {
          id: 1,
          username: 'JohnDoe',
          email: 'john.doe@example.com',
          mobile_no: '1234567890',
          date_joined: '2023-01-01',
        }
        // Add more staff members if needed
        // {
        //   id: 2,
        //   username: 'John',
        //   email: 'john@example.com',
        //   mobile_no: '1234561890',
        //   date_joined: '2023-02-01',
        // },
      ],
    },
  });
  render(
    <Router>
      <Stafflist />
    </Router>
  );

  // Trigger the removestaff function
  expect(screen.getByText('Staff Managment')).toBeInTheDocument();
  await waitFor(()=>{
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    // fireEvent.click(screen.getByText('remove'));

  })


  await act(async () => {
    fireEvent.click(screen.getByText('remove'));
  });

  // Ensure that the removestaff API was called with the correct ID
  expect(managerService.removestaff).toHaveBeenCalledWith(1);

  // expect(managerService.removestaff).not.toHaveBeenCalled();
  // Check if navigate to '/login' was called
  // expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');

  // Ensure that removestaff is not called

});



});
