import { Link } from 'react-router-dom';
import Footer from './footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import * as formik from 'formik';
import * as yup from 'yup';
import { customerService } from './apiurls';
import { useUser } from './UserContext';


function LoginPage() {
  const { Formik } = formik;
  const [formValue, setFormValue] = useState({ username: '', password: '' });
  const [showToast, setShowToast] = useState(false);
  const [inactivetoast,setinactivetoast] = useState(false);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [userType, setUserType] = useState('');
  const { updateUsername } = useUser();
  const { updatebalance } = useUser();


  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        setLoading(true);
        const data={username:formValue.username,password:formValue.password}
        const response = await customerService.login(formValue);

        if (response.status === 200) {
          const accessToken = response.data.access;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('id',response.data.id);
          localStorage.setItem('usertype',response.data.user_type);
          updateUsername(response.data.username);
          
          if(response.data.user_type==='customer'){
            if(response.data.activity_status===true){    
              updatebalance(response.data.balance);        
              navigate('/customerhome');            
            }
            else{
              localStorage.clear();
              setinactivetoast(true);
            }

          }
          else if(response.data.user_type==='staff'){
            navigate('/customerList');
        }
        else {
          navigate('/Stafflist');
      }
         }
         else{
          console.error('Invalid credentials');
         }
          
      } catch (error) {
        localStorage.clear();
        console.error('Invalid credentials');
        console.log(error);
        localStorage.clear();
        setShowToast(true);
        setFormValue({ username: '', password: '' });
      }
      finally {
        setLoading(false); // Set loading to false after the API call is complete
      }
    }

    setValidated(true);
  };
  const schema = yup.object().shape({
    username: yup.string().required('Username is requid'),
    password: yup.string().required('Password is required'),
  });


  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <h1 className="text-center">Login</h1>
          <Formik
            validationSchema={schema}
            initialValues={{ username: '', password: '' }}
          
          >
      {({ handleSubmit, handleChange, values, touched, errors }) => (

          <Form noValidate validated={validated}  onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail"> 
              <FloatingLabel controlId="floatingInput"  label="Username" className="mb-3">
                <Form.Control
                  type="text"
                  name="username"
                  value={formValue.username}
                  onChange={handleInput}
                  isInvalid={!!errors.username}
                  // placeholder="Enter username"
                  required
                />
            <Form.Control.Feedback type="invalid">
              Please enter a username.
            </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  name="password"
                  value={formValue.password}
                  onChange={handleInput}
                  placeholder="Password"
                  required
                />
            <Form.Control.Feedback type="invalid">
              Please enter a password
            </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Button variant="outline-primary" type="submit" style={{ width: '100%' }}>
            {loading ? <Spinner animation="border" variant="light" /> : 'LOGIN'}
            </Button>
          </Form>
           )}
           
           </Formik>
           
        </Card.Body>
        <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      </Card>
      
      {showToast && (
      <Toast onClose={() => setShowToast(false)} className="position-absolute top-0 end-0 mt-2 me-2">
        <Toast.Header>
          <strong className="me-auto">Invalid credentials</strong>
        </Toast.Header>
        <Toast.Body>please enter a valid username and password</Toast.Body>
      </Toast>
      
    )}
    <Toast
          show={inactivetoast}         
          onClose={() => setinactivetoast(false)}
          className="position-absolute top-0 end-0 mt-2 me-2">

        
          <Toast.Header>
            <strong className="me-auto">Inactive Account</strong>
          </Toast.Header>
          <Toast.Body>Your account is currently inactive. Please contact support.</Toast.Body>
        </Toast>
    
      <Footer />
    </div>
  );
}

export default LoginPage;
