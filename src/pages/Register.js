import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, FloatingLabel } from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: เรียก API สมัครสมาชิก
    console.log(form);
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold text-center mb-4">Register</h1>

              <Form noValidate onSubmit={onSubmit}>
                <FloatingLabel controlId="name" label="Full Name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    size="lg"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel controlId="email" label="Email" className="mb-3">
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

                <FloatingLabel controlId="password" label="Password" className="mb-3">
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

                <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    placeholder="••••••••"
                    size="lg"
                    required
                  />
                </FloatingLabel>

                <Button type="submit" variant="success" size="lg" className="w-100">
                  Create Account
                </Button>
              </Form>

              <p className="text-center text-muted mt-4 mb-0">
                มีบัญชีอยู่แล้ว?{" "}
                <a href="/login" className="link-success text-decoration-none">
                  Login
                </a>
              </p>
            </Card.Body>
          </Card>

          <p className="text-center text-muted small mt-3 mb-0">
            © {new Date().getFullYear()} RMUTL Foods
          </p>
        </Col>
      </Row>
    </Container>
  );
}
