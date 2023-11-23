import { useState } from 'react';
import { Form, Button, Container, Row, Col , Toast } from 'react-bootstrap';
import BankNavbar from './bank_nav';
import axios from 'axios';
import { customerService } from './apiurls';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useUser } from './UserContext';
import { toBeRequired } from '@testing-library/jest-dom/matchers';

function Transactionpage() {
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [transactionType, setTransactionType] = useState('deposit');
  const { acntbalance,updatebalance } = useUser();
  const [showToast, setShowToast] = useState(false);
  const [toastColor, setToastColor] = useState('green');

  const handledepositChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);
    const updatedBalance = acntbalance + enteredAmount;

    // Assuming you have a function to fetch and update the account balance
    // Replace the function below with your actual logic
    updatebalance(updatedBalance);
  };
  const handlewithdrwChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);
    const updatedBalance = acntbalance - enteredAmount;

    // Assuming you have a function to fetch and update the account balance
    // Replace the function below with your actual logic
    updatebalance(updatedBalance);
  };

  const handledeposit = async (e) => {
    e.preventDefault();

    try {
      const data = {amount: amount,transaction_type: 'deposit'}
  
      const response = await customerService.transaction(data);

      console.log('Transaction successful:', response.data);
      const updatedBalance = acntbalance + amount;
      updatebalance(updatedBalance);
      setShowToast(true);
      setToastColor('green');
      setSubmitted(true);
      // Add logic to handle success, e.g., display a success message to the user
    } catch (error) {
      console.error('Transaction failed:', error);
      console.log()
      // Handle error scenario, e.g., show an error message to the user
    }
  };
  const handlewithdraw = async (e) => {
    e.preventDefault();

    try {
      const data = {amount: amount,transaction_type: 'withdrawal'}
  
      const response = await customerService.transaction(data);

      console.log('Transaction successful:', response.data);
      const updatedBalance = acntbalance - amount;
      updatebalance(updatedBalance);
      setSubmitted(true);
      setShowToast(true);
      setToastColor('red');
      // Add logic to handle success, e.g., display a success message to the user
    } catch (error) {
      console.error('Transaction failed:', error);
      console.log()
      // Handle error scenario, e.g., show an error message to the user
    }
  };


  return (
    <div>
       <BankNavbar />
    <Container className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
      <h1>BALANCE : rs {acntbalance}</h1>

      {/* Grid system for side-by-side forms */}
      <Row>
        {/* Deposit Form */}
        <Col md={6}>
          <Form style={{ width: '300px' }} onSubmit={handledeposit}>
            {/* Amount Input */}
            <Form.Group className="mb-3">
              <FloatingLabel controlId="floatingInput" label="Amount" className="mb-3">
                <Form.Control
                  type="number"
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>

            {/* Transaction Type Selector (Hidden for Deposit) */}
            <input type="hidden" name="transactionType" value="deposit" />

            {/* Confirmation Button */}
 
              <Button variant="success" type="submit" className="w-100">
                ADD MONEY
              </Button>
          </Form>
        </Col>

        {/* Withdrawal Form */}
        <Col md={6}>
        <Form style={{ width: '300px' }} onSubmit={handlewithdraw}>
  {/* Amount Input */}
  <Form.Group className="mb-3">
    <FloatingLabel controlId="floatingInput" label="Amount" className="mb-3">
      <Form.Control
        type="number"
        name="amount"
        onChange={(e) => setAmount(e.target.value)}
        isInvalid={parseFloat(amount) > acntbalance}
      />
    </FloatingLabel>
    <Form.Control.Feedback type="invalid">
      Amount cannot exceed the available balance.
    </Form.Control.Feedback>
  </Form.Group>

  {/* Transaction Type Selector (Hidden for Withdrawal) */}
  <input type="hidden" name="transactionType" value="Withdrawal" />

  {/* Confirmation Button */}

    <Button disabled={parseFloat(amount) > acntbalance} variant="danger" type="submit" className="w-100">
      WITHDRAW
    </Button>
  
</Form>
        </Col>
      </Row>
      <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          style={{ backgroundColor: toastColor }}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto" style={{ color: 'black' }}>
               Transaction Successful
            </strong>
          </Toast.Header>
          <Toast.Body style={{ color: 'white' }}>
            {toastColor === 'green' ? 'Amount added successfully!' : 'Amount withdrawn successfully!'}
          </Toast.Body>
        </Toast>

    </Container>
  </div>

  );
}

export default Transactionpage;
