import { Container, Nav, Navbar } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BankNavbar() {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('usertype');
  let home ='/customerhome';
  if(usertype==='customer')
  {let home ='/customerhome';}
  else if(usertype==='staff')
  {let home='/customerlist';}
  else
  {let home='/Stafflist';}
  const logout = () => {
    localStorage.clear();
    navigate('/login');
}
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href={home}>Innovature Bank</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto"> {/* ml-auto to align items to the right */}
            <Nav.Link href={home}>Home</Nav.Link>
          </Nav>
          <Nav className="ml-auto"> {/* ml-auto to align items to the right */}
            <Nav.Link href="/updateprofile">update_profile</Nav.Link>
          </Nav>
          <Button onClick={logout} variant="outline-light" >Sign Out</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BankNavbar;




