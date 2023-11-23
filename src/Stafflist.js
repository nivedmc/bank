import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BankNavbar from './bank_nav';
import Button from 'react-bootstrap/Button';
import { managerService } from './apiurls';
import RegisterPage from './register';

const Stafflist = () => {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  // const removeApprovedCustomers = (customerId) => {
  //   setCustomers(customers.filter((customer) => customer.account_number !== customerId));
  // };

  const handleAddStaff = () => {
    navigate('/staffregister'); // Replace '/staff/register' with the actual route to your staff registration page
  };

  const removestaff = async (id) => {
    const token = localStorage.getItem('token');
    try {
        
        await managerService.removestaff(id);
        setStaff((prevStaff) =>
        prevStaff.filter((Staff) => Staff.id !== id)
      );
      


    } 
    catch (error) {
      console.error('Error deactivating customer', error);
    }
  }

  useEffect(() => {
    async function fetchStaff() {
      const token = localStorage.getItem('token');
      try {
        if (!token) {
            navigate('/login')
        }
        const response = await managerService.Staffmanagment();
// Replace with your API endpoint
        setStaff(response.data.results);
 // Assuming your response contains an array of customers
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    }

  

    fetchStaff();

  }, []);


  return (
    <div>
    <BankNavbar/>
    <Container>
      <h2>Staff Managment</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact no.</th>
            <th>Date joined</th>
            {/* Add other columns you want to display */}
          </tr>
        </thead>
        <tbody>
          {staff.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.id}</td>
              <td>{staff.username}</td>
              <td>{staff.email}</td>
              <td>{staff.mobile_no}</td>
              <td>{staff.date_joined}</td>
              <td><Button variant="outline-danger" onClick={()=>{removestaff(staff.id)}}>remove </Button></td>
            </tr>

          ))}
                <Button variant="primary" size="lg" onClick={handleAddStaff}>
        +add a staff
      </Button>
        </tbody>
   
      </Table>

    </Container>
    </div>
  );
}

export default Stafflist;