// src/components/AppNavbar.js
import { Link, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap"; // ✅ เพิ่ม Badge
import { useCart } from "../context/CartContext";                          // ✅ NEW

export default function AppNavbar({ authed, role, onLogout }) {
  const email = localStorage.getItem("userEmail") || "";
  const { count } = useCart(); // ✅ ดึงจำนวนในตะกร้า

  const isCustomer = authed && role === "customer";
  const isVendor   = authed && role === "vendor";
  const isGuest    = !authed;

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

            {/* ------ เมนูลูกค้า (แสดงเฉพาะ "ตอนเป็นลูกค้า") ------ */}
            {isCustomer && (
              <>
                {/* ร้านค้า = หน้า Home ลูกค้า */}
                <Nav.Link as={NavLink} to="/shop/vendors">ร้านค้า</Nav.Link>

                {/* ตะกร้า + badge จำนวนสินค้า */}
                <Nav.Link as={NavLink} to="/shop/cart" className="position-relative">
                  ตะกร้า{" "}
                  {count > 0 && (
                    <Badge bg="success" pill className="align-middle ms-1">
                      {count}
                    </Badge>
                  )}
                </Nav.Link>

                {/* โปรไฟล์ลูกค้า */}
                <Nav.Link as={NavLink} to="/customer/profile">โปรไฟล์</Nav.Link>

                {/* การแจ้งเตือนลูกค้า */}
                <Nav.Link as={NavLink} to="/customer/notifications">แจ้งเตือน</Nav.Link>

                <span className="text-muted small d-none d-md-inline mx-2">{email}</span>
                <Nav.Link className="ms-md-2">
                  <Button variant="custom-danger" className="rounded-pill fw-bold px-4" onClick={onLogout}>
                    ออกจากระบบ
                  </Button>
                </Nav.Link>
              </>
            )}

            {/* ------ GUEST (ยังไม่ล็อกอิน) ------ */}
            {isGuest && (
              <>
                <Nav.Link as={NavLink} to="/login">เข้าสู่ระบบ</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="ms-md-2">
                  <Button variant="outline-success" className="px-3">สมัครสมาชิก</Button>
                </Nav.Link>

                <span className="d-none d-md-inline px-2 text-muted">|</span>
                <Nav.Link as={NavLink} to="/vendor/login" className="text-muted">
                  สำหรับร้านค้า
                </Nav.Link>
              </>
            )}

            {/* ------ เมนูร้านค้า (เฉพาะตอนเป็นร้านค้า) ------ */}
            {isVendor && (
              <>
                <Nav.Link as={NavLink} to="/vendor/menu">เมนู</Nav.Link>
                <Nav.Link as={NavLink} to="/vendor/orders">รายการสั่งซื้อ</Nav.Link>
                <Nav.Link as={NavLink} to="/vendor/notifications">การแจ้งเตือน</Nav.Link>
                <Nav.Link as={NavLink} to="/vendor/profile">โปรไฟล์</Nav.Link>
                <span className="text-muted small d-none d-md-inline mx-2">{email}</span>
                <Nav.Link className="ms-md-2">
                  <Button
                    variant="custom-danger"
                    className="rounded-pill fw-bold px-4"
                    onClick={onLogout}
                  >
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
