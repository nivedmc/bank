import React from 'react';
import { render, screen, waitFor,fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomerList from './CustomerList';
import { staffService } from './apiurls';


jest.mock('./apiurls');

describe('CustomerList Component', () => {
  beforeEach(() => {
    // jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
    staffService.pendinglist.mockClear();
  });
  
  it('renders customer list', async () => {
    
    // Mock the pendinglist response

    staffService.pendinglist.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            account_number: '123456789',
            is_active: true,

          },
          {
            id: 2,
            account_number: '123559789',
            is_active: false,
          },
          {
            id: 3,
            account_number: '122556789',
            is_active: false,
          },
          {
            id: 4,
            account_number: '122550789',
            is_active: true,
          
          },

          // Add more customer objects as needed
        ],

      },
    });


    render(
      <Router>
        <CustomerList />
      </Router>
    );
    // fireEvent.click(screen.getByText('1'));

    // // Wait for the details modal to appear
    // await waitFor(() => {
    //   expect(screen.getByText('ID: 1')).toBeInTheDocument();
    //   // Add assertions for other details based on your UI
    // });
    // fireEvent.click(screen.getByText('Close'));
    // await waitFor(() => {
    //   expect(screen.queryByText('ID: 1')).toBeNull();

    //   // Add assertions for other details based on your UI
    // });




  });

  // it('renders customer list and performs actionss', async () => {
  //   jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
  //   // const mockCustomer = {
  //   //   results: [
  //   //     {
  //   //       id: 1,
  //   //       account_number: '123456789',
  //   //       is_active: false,
  //   //       // Add other necessary fields
  //   //     },
  //   //     {
  //   //       id: 2,
  //   //       account_number: '123556789',
  //   //       is_active: true,
  //   //       // Add other necessary fields
  //   //     },

  //   //     // Add more customer objects as needed
  //   //   ],

  //   // }
  //   staffService.pendinglist.mockResolvedValueOnce({
  //     data: {
  //       results: [
  //         {
  //           id: 1,
  //           account_number: '123456789',
  //           is_active: false,
  //           // Add other necessary fields
  //         },
  //         // {
  //         //   id: 2,
  //         //   account_number: '123556789',
  //         //   is_active: true,
  //         //   // Add other necessary fields
  //         // },

  //         // Add more customer objects as needed
  //       ],

  //     },
  //   });

  //   render(
  //     <Router>
  //       <CustomerList />
  //     </Router>
  //   );

  //   // Wait for the component to fetch and render the customer list
  //   expect(screen.getByText('Customer List')).toBeInTheDocument();
  //   await waitFor(()=>{
  //     expect(screen.getByText('1')).toBeInTheDocument();
  //     expect(screen.getByText('123456789')).toBeInTheDocument();
  //     expect(screen.getByText('Pending')).toBeInTheDocument();
  //     // fireEvent.click(screen.getByText('remove'));

  //   })


  //   await waitFor(() => {
  //     const approveButton = screen.getByText('APPROVE');  // Adjust based on your actual button text or element

  //     // Trigger the approval action
  //     fireEvent.click(approveButton);
  //     // Expect the approveAccount function to be called with the correct account number
  //     expect(staffService.approveAccount).toHaveBeenCalledWith('123456789');
  //     // You might want to assert other changes in the UI or state after approval
  //   });
  //   render(
  //     <Router>
  //       <CustomerList />
  //     </Router>
  //   );
  //   await waitFor(()=>{
  //     expect(screen.getByText('1')).toBeInTheDocument();
  //     expect(screen.getByText('123456789')).toBeInTheDocument();
  //     expect(screen.getByText('Approved')).toBeInTheDocument();
  //     // fireEvent.click(screen.getByText('remove'));

  //   })
  // });

  it('renders customer list and approve pending customer', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('q2wr12r4fwf');
    // Mock the pendinglist response
    const mockCustomerData = {
      results: [
        {
          id: 1,
          account_number: '123456789',
          is_active: false,
          // Add other necessary fields
        },
        // Add more customer objects as needed
      ],
    };

    staffService.pendinglist.mockResolvedValueOnce({
      data: mockCustomerData,
    });

    render(
      <Router>
        <CustomerList />
      </Router>
    );

    // Wait for the component to fetch and render the customer list
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('123456789')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      // fireEvent.click(screen.getByText('remove'));

    })


    await waitFor(() => {
      const approveButton = screen.getByText('APPROVE');  // Adjust based on your actual button text or element

      // Trigger the approval action
      fireEvent.click(approveButton);
      // Expect the approveAccount function to be called with the correct account number
      expect(staffService.approveAccount).toHaveBeenCalledWith('123456789');
      // You might want to assert other changes in the UI or state after approval
    });
    render(
      <Router>
        <CustomerList />
      </Router>)
    await waitFor(()=>{
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('123456789')).toBeInTheDocument();
      expect(screen.getByText('Approved')).toBeInTheDocument();
      // fireEvent.click(screen.getByText('remove'));

    })
        await waitFor(() => {
      const deactivateButton = screen.getByText('DEACTIVATE');  // Adjust based on your actual button text or element

      // Trigger the approval action
      fireEvent.click(deactivateButton);
      // Expect the approveAccount function to be called with the correct account number
      expect(staffService.deactivateAccount).toHaveBeenCalledWith('123456789');


  });
  render(
    <Router>
      <CustomerList />
    </Router>)
  await waitFor(()=>{
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    // fireEvent.click(screen.getByText('remove'));

  })


});

  // it('renders customer list and performs deactivate actions', async () => {
    
  //   // Mock the pendinglist response

  //   staffService.pendinglist.mockResolvedValueOnce({
  //     data: {
  //       results: [
  //         {
  //           id: 1,
  //           account_number: '223456789',
  //           is_active: true,
  //           // Add other necessary fields
  //         },
  //         // {
  //         //   id: 2,
  //         //   account_number: '123556789',
  //         //   is_active: true,
  //         //   // Add other necessary fields
  //         // },

  //         // Add more customer objects as needed
  //       ],

  //     },
  //   });

  //   render(
  //     <Router>
  //       <CustomerList />
  //     </Router>
  //   );

  //   // Wait for the component to fetch and render the customer list
  //   expect(screen.getByText('Customer List')).toBeInTheDocument();
  //   await waitFor(()=>{
  //     expect(screen.getByText('1')).toBeInTheDocument();
  //     expect(screen.getByText('123456789')).toBeInTheDocument();
  //     expect(screen.getByText('Approved')).toBeInTheDocument();
  //     // fireEvent.click(screen.getByText('remove'));

  //   })
  //   await waitFor(() => {
  //     const deactivateButton = screen.getByText('DEACTIVATE');  // Adjust based on your actual button text or element

  //     // Trigger the approval action
  //     fireEvent.click(deactivateButton);
  //     // Expect the approveAccount function to be called with the correct account number
  //     expect(staffService.deactivateAccount).toHaveBeenCalledWith('123456789');
  //     // You might want to assert other changes in the UI or state after approval
  //   });
  // });



  
});
