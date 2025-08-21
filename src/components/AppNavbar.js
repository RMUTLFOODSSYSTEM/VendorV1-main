import { Link, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function AppNavbar({ authed, onLogout }) {
  return (
    <Navbar
      bg="white"
      variant="light"
      expand="md"
      sticky="top"
      className="border-bottom shadow-sm"
      collapseOnSelect
    >
      <Container>
      <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
        RMUTL Foods
      </Navbar.Brand>


        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-md-center">
            {!authed ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="ms-md-2">
                  <Button variant="outline-success" className="px-3">Register</Button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/menu">เมนู</Nav.Link>
                <Nav.Link as={NavLink} to="/profile">โปรไฟล์</Nav.Link>
                <Nav.Link as={NavLink} to="/orders">รายการสั่งซื้อ</Nav.Link>
                <Nav.Link as={NavLink} to="/notifications">การแจ้งเตือน</Nav.Link>
                <Nav.Link className="ms-md-2">
                  <Button variant="custom-danger" className="rounded-pill fw-bold px-4"
                   onClick={onLogout}>
                   Logout
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
