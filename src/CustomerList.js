import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Modal, Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import BankNavbar from './bank_nav';
import { staffService } from './apiurls';
import { toBeRequired } from '@testing-library/jest-dom/matchers';


function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const itemsPerPage = 5;

  const navigate = useNavigate();


  const approvecustomer = async (Account_number) => {
    setSelectedCustomer(null);
    setShowDetails(false);
    const token = localStorage.getItem('token');
    try {
      // if (!token) {
      //   navigate('/login');
      // }
      await staffService.approveAccount(Account_number);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.account_number === Account_number
            ? { ...customer, is_active: true } // Update with your field and value
            : customer
        )
      );
      // You might want to update the state or re-fetch the list of customers after approval
    } 
    catch (error) {
      console.error('Error approving customer', error);
    }
  }
  const deactivatecustomer = async (Account_number) => {
    setSelectedCustomer(null);
    setShowDetails(false);
    const token = localStorage.getItem('token');
    try {
      await staffService.deactivateAccount(Account_number);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.account_number === Account_number
            ? { ...customer, is_active: false } // Update with your field and value
            : customer
        )
        
      );
      // You might want to update the state or re-fetch the list of customers after approval
    } 
    catch (error) {
      console.error('Error deactivating customer', error);
    }
  }

  const showCustomerDetails = async (customer) => {
    const response = await staffService.accountdetails(customer.id);
    setSelectedCustomer(response.data);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setShowDetails(false);
  };


  useEffect(() => {
    async function fetchCustomers() {
      const token = localStorage.getItem('token');
      try {
        if (!token) {
            navigate('/login')
        }
        const response = await staffService.pendinglist();
        const sortedCustomers = response.data.results.sort((a, b) => {
          // Convert boolean to number for proper sorting
          const aStatus = a.activity_status ? 1 : 0;
          const bStatus = b.activity_status ? 1 : 0;
        
          return aStatus - bStatus;
        });
        // const response = await axios.get('http://127.0.0.1:8000/api/pendingcustomers/',
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // Include the token in the authorization header
        //   },
        // }); // Replace with your API endpoint
        setCustomers(sortedCustomers);
        // setTotalPages(response.data.total_pages);
        // // console.log(response.data)
 // Assuming your response contains an array of customers
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    }
    fetchCustomers();

  },[] );

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  return (
    <div>
    <BankNavbar/>
    <Container>
      <h2>Customer List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Number</th>
            <th>Account status</th>
            {/* Add other columns you want to display */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} onClick={() => showCustomerDetails(customer)}>
              <td>{customer.id}</td>
              <td>{customer.account_number}</td>
              <td className={customer.is_active ? 'approved' : 'pending'}>
                  {customer.is_active ? 'Approved' : 'Pending'}
                </td>
              <td><Button disabled={customer.is_active} variant="outline-success" onClick={() => {approvecustomer(customer.account_number);
                }}>APPROVE</Button>{' '}</td>

              <td><Button disabled={!customer.is_active} variant="outline-danger" onClick={() => {deactivatecustomer(customer.account_number);
                }}>DEACTIVATE </Button>{' '}</td>
 
              {/* Add other table data cells according to your customer data */}
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedCustomer && (
          <Modal show={showDetails} onHide={handleCloseDetails}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedCustomer.username}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Render details based on the selectedCustomer */}
              <p>ID: {selectedCustomer.user_id}</p>
              <p>Account Number: {selectedCustomer.account_number}</p>
              <p>email: {selectedCustomer.email}</p>
              <p>mobile no: {selectedCustomer.mob_no}</p>
              <p>date joined: {selectedCustomer.date_joined}</p>
              {/* Add other details */}
            </Modal.Body>
            <Modal.Footer>
            <Button disabled={selectedCustomer.is_active} variant="outline-success" onClick={() => {approvecustomer(selectedCustomer.account_number);
                }}>APPROVE</Button>
            <Button disabled={!selectedCustomer.is_active} variant="outline-danger" onClick={() => {deactivatecustomer(selectedCustomer.account_number);
                }}>DEACTIVATE </Button>
                

            </Modal.Footer>
          </Modal>
        )}


    </Container>
    </div>
  );
}

export default CustomerList;
