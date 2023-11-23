import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { customerService } from './apiurls';

function StaffRegisterPage() {
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile_no: '',
    date_of_birth: '',
    user_type: 'staff',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth') {
      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData({ ...formData, [name]: value });
  };
}


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await customerService.register(formData);
      navigate('/Stafflist');
    }
    catch (error) {
      console.error('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <h2 className="text-center text-dark">Staff Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="mb-3">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="mb-3">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            <Form.Control.Feedback type="invalid">
              Please enter a username.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobile">
              <Form.Label className="mb-3">Mobile No</Form.Label>
              <Form.Control
                type="tel"
                name="mobile_no"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Form.Label className="mb-3">Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                // value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="userType">
              <Form.Label className="mb-3">User Type</Form.Label>
              <Form.Control
                name="user_type"
                value="staff"
                onChange={handleChange}
                required
              >
              </Form.Control>
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="mb-3">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  </div>
  );
}

export default StaffRegisterPage;