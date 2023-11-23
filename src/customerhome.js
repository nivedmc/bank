import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import BankNavbar from './bank_nav';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { username } = useUser();
  const { acntbalance } =useUser();

  const handleTransaction = () => {
    navigate('/transactionpage');
    console.log('Performing transaction...');
  };
  const downloadtransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      // Make a fetch request to the backend API to get the CSV file
      const response = await fetch('http://127.0.0.1:8000/api/export-transactions/', {
        method: 'GET',
        headers: {
           Authorization: `Bearer ${token}`,
          'Content-Type': 'text/csv', // Set the appropriate content type
          // Add any necessary authentication or additional headers
        },
      });

      // Retrieve the blob object (assuming the response is a Blob containing the CSV data)
      const blob = await response.blob();

      // Create a temporary anchor element to trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transaction_history.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup: Remove the anchor element and URL object after download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading transactions:', error);
      // Handle errors accordingly, such as displaying an error message to the user
    }
  };

  return (
    <div>
      < BankNavbar />
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Welcome,{ username }!</h2>
        </Col>
        {/* <Col className="text-end">
          <Button variant="outline-secondary" onClick={handleSignOut}>Sign Out</Button>
        </Col> */}
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>BALANCE:</Card.Title>
              <Card.Text>
              Rs { acntbalance }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Transactions</Card.Title>
              <Card.Text>
                User's transaction history or summary can be displayed here.
              </Card.Text>
              <Button onClick={handleTransaction}>make a Transaction</Button>
              <Button onClick={downloadtransactions}>download Transaction</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
    </div>
    
  );
};

export default CustomerDashboard;
