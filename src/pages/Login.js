import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, FloatingLabel } from "react-bootstrap";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: เรียก API จริง
    localStorage.setItem("userEmail", form.email);
    onLogin?.(form.email); // // <— ส่งอีเมลกลับไปให้ App เก็บ
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold text-center mb-4">Login</h1>

              <Form noValidate onSubmit={onSubmit}>
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

                <FloatingLabel controlId="password" label="Password" className="mb-2">
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
                  <a className="small text-decoration-none" href="/forgot-password">
                  
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" variant="success" size="lg" className="w-100 rounded-pill">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
