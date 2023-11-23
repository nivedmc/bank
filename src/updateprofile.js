import React, { useState,useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { customerService } from './apiurls';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    // password: '',
    // confirmPassword: '',
  });
  const navigate = useNavigate();


  const fetchUserData = async () => {
    try {
      const response = await customerService.userdetails(localStorage.getItem('id'))
      const userData = response.data;  
      setFormData({
        username: userData.username || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name|| '',
        email: userData.email,
        // password: '',  // Omit password for security reasons
        // confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useEffect(() => {
    fetchUserData();  // Call fetchUserData when the component mounts
  }, []);

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await customerService.updateprofile(localStorage.getItem('id'),formData);
        navigate('/login');
      }
      catch (error) {
        console.error('Invalid credentials');
      }
  };

  return (
    <Container>
      <h2>Update Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </Form.Group> */}

        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Update Profile
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateProfile;
