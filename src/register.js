import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { customerService } from './apiurls';
import { toast, ToastContainer } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await customerService.register(values);
      toast.success('Registration successful! You can now log in.');
      // navigate('/login');
    } catch (error) {
      console.error('Invalid credentials');
    }
  };

  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile_no: yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
    date_of_birth: yup.date().required('Date of Birth is required'),
    user_type: yup.string().required('User Type is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <h2 className="text-center text-dark">User Registration</h2>
            <Formik
              initialValues={{
                username: '',
                email: '',
                mobile_no: '',
                date_of_birth: '',
                user_type: '',
                password: '',
              }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label mb-3">Username</label>
                  <Field type="text" id="username" name="username" className="form-control" />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label mb-3">Email</label>
                  <Field type="email"id="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile_no" className="form-label mb-3">Mobile No</label>
                  <Field type="tel" id="mobile_no" name="mobile_no" className="form-control" />
                  <ErrorMessage name="mobile_no" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="date_of_birth" className="form-label mb-3">Date of Birth</label>
                  <Field type="date" id="date_of_birth" name="date_of_birth" className="form-control" />
                  <ErrorMessage name="date_of_birth" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="user_type" className="form-label mb-3">User Type</label>
                  <Field as="select" id="user_type" name="user_type" className="form-control">
                    <option value="">Select user type</option>
                    <option value="customer">customer</option>
                  </Field>
                  <ErrorMessage name="user_type" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label mb-3">Password</label>
                  <Field type="password" id="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <Button variant="primary" type="submit">
                  Register
                </Button>
              </Form>
            </Formik>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
