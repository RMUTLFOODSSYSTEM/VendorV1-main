import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, FloatingLabel, Alert } from "react-bootstrap";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    // TODO: เรียก API จริง (ตอนนี้ mock ให้ล็อกอินได้หมด)
    localStorage.setItem("userEmail", form.email);
    localStorage.setItem("role", "vendor");   // 🟢 บอกบทบาทร้านค้า
    onLogin?.(form.email);                    // 🟢 แจ้ง App ให้ authed = true
    nav("/vendor/menu");                      // 🟢 เข้าหน้าเมนูของร้านค้า
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold text-center mb-4">เข้าสู่ระบบ (ร้านค้า)</h1>

              {err && <Alert variant="danger" className="py-2">{err}</Alert>}

              <Form noValidate onSubmit={onSubmit}>
                <FloatingLabel controlId="email" label="อีเมล" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    size="lg"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel controlId="password" label="รหัสผ่าน" className="mb-2">
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    size="lg"
                    required
                    minLength={6}
                  />
                </FloatingLabel>

                <div className="d-flex justify-content-end mb-3">
                  {/* 🟢 ใช้ Link และไป path ของร้านค้า */}
                  <Link className="small text-decoration-none" to="/vendor/forgot-password">
                    ลืมรหัสผ่าน?
                  </Link>
                </div>

                <Button type="submit" variant="success" size="lg" className="w-100 rounded-pill">
                  เข้าสู่ระบบ
                </Button>
              </Form>

              <div className="text-center mt-3">
                ยังไม่มีบัญชี? <Link to="/vendor/register">สมัคร(ร้านค้า)</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
