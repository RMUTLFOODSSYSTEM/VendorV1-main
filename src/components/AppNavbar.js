// src/components/AppNavbar.js
import { Link, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext";

export default function AppNavbar({ authed, role, onLogout }) {
  const email = localStorage.getItem("userEmail") || "";
  const { count } = useCart();

  const isCustomer = authed && role === "customer";
  const isVendor = authed && role === "vendor";
  const isAdmin = authed && role === "admin";
  const isGuest = !authed;

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
            {isCustomer && (
              <>
                <Nav.Link as={NavLink} to="/shop/vendors">
                  ร้านค้า
                </Nav.Link>

                <Nav.Link as={NavLink} to="/shop/cart" className="position-relative">
                  ตะกร้า{" "}
                  {count > 0 && (
                    <Badge bg="success" pill className="align-middle ms-1">
                      {count}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link as={NavLink} to="/shop/orders">
                  คำสั่งซื้อ
                </Nav.Link>

                <Nav.Link as={NavLink} to="/customer/complaint">
                  ร้องเรียน
                </Nav.Link>

                <Nav.Link as={NavLink} to="/customer/notifications">
                  แจ้งเตือน
                </Nav.Link>

                <Nav.Link as={NavLink} to="/customer/profile">
                  โปรไฟล์
                </Nav.Link>

                <span className="text-muted small d-none d-md-inline mx-2">
                  {email}
                </span>

                <Nav.Link className="ms-md-2">
                  <Button
                    variant="custom-danger"
                    className="rounded-pill fw-bold px-4"
                    onClick={onLogout}
                  >
                    ออกจากระบบ
                  </Button>
                </Nav.Link>
              </>
            )}

            {isGuest && (
              <>
                <Nav.Link as={NavLink} to="/login">
                  เข้าสู่ระบบ
                </Nav.Link>

                <Nav.Link as={NavLink} to="/register" className="ms-md-2">
                  <Button variant="outline-success" className="px-3">
                    สมัครสมาชิก
                  </Button>
                </Nav.Link>

                <span className="d-none d-md-inline px-2 text-muted">|</span>

                <Nav.Link as={NavLink} to="/vendor/login" className="text-muted">
                  สำหรับร้านค้า
                </Nav.Link>

                <Nav.Link as={NavLink} to="/admin/login" className="text-muted">
                  สำหรับแอดมิน
                </Nav.Link>
              </>
            )}

            {isVendor && (
              <>
                <Nav.Link as={NavLink} to="/vendor/menu">
                  เมนู
                </Nav.Link>

                <Nav.Link as={NavLink} to="/vendor/orders">
                  รายการสั่งซื้อ
                </Nav.Link>

                <Nav.Link as={NavLink} to="/vendor/reports">
                  รายงานและสถิติ
                </Nav.Link>

                <Nav.Link as={NavLink} to="/vendor/complaint">
                  ร้องเรียน
                </Nav.Link>

                <Nav.Link as={NavLink} to="/vendor/notifications">
                  การแจ้งเตือน
                </Nav.Link>

                <Nav.Link as={NavLink} to="/vendor/profile">
                  โปรไฟล์
                </Nav.Link>

                <span className="text-muted small d-none d-md-inline mx-2">
                  {email}
                </span>

                <Nav.Link className="ms-md-2">
                  <Button
                    variant="custom-danger"
                    className="rounded-pill fw-bold px-4"
                    onClick={onLogout}
                  >
                    ออกจากระบบ
                  </Button>
                </Nav.Link>
              </>
            )}

            {isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/admin/dashboard">
                  ภาพรวมระบบ
                </Nav.Link>

                <Nav.Link as={NavLink} to="/admin/users">
                  ผู้ใช้
                </Nav.Link>

                <Nav.Link as={NavLink} to="/admin/vendors">
                  ร้านค้า
                </Nav.Link>

                <Nav.Link as={NavLink} to="/admin/payments">
                  การชำระเงิน
                </Nav.Link>

                <Nav.Link as={NavLink} to="/admin/complaints">
                  ข้อร้องเรียน
                </Nav.Link>

                <span className="text-muted small d-none d-md-inline mx-2">
                  {email}
                </span>

                <Nav.Link className="ms-md-2">
                  <Button
                    variant="custom-danger"
                    className="rounded-pill fw-bold px-4"
                    onClick={onLogout}
                  >
                    ออกจากระบบ
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