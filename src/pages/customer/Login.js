import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function CustomerLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  // --- MOCK ตรวจรหัสจาก localStorage: "customers"
  const trySignIn = (email, password) => {
    const db = JSON.parse(localStorage.getItem("customers") || "[]");
    const user = db.find(
      u =>
        String(u.email).toLowerCase().trim() === String(email).toLowerCase().trim() &&
        String(u.password) === String(password)
    );
    return !!user;
  };

  const submit = (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    // ✅ เปลี่ยนเป็นตรวจกับ mock DB; ถ้าไม่มีสมัครไว้ จะล้มเหลว
    if (!trySignIn(email, password)) {
      setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    // ✅ บอกบทบาทเป็นลูกค้า + กระตุ้น App/ Navbar
    localStorage.setItem("userEmail", email);
    localStorage.setItem("role", "customer");
    onLogin?.(email);              // App.js จะ map เป็น handleLogin(email,"customer")
    nav("/customer");
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="p-4 rounded-4 shadow-sm" style={{ maxWidth: 420, width: "100%" }}>
        <h4 className="text-center mb-4">เข้าสู่ระบบ</h4>

        {err && <Alert variant="danger" className="py-2">{err}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>อีเมล</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              required
              minLength={6}
            />
          </Form.Group>

          <div className="d-flex justify-content-end mb-3">
            <Link to="/vendor/forgot-password" className="small text-decoration-none">
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <Button type="submit" variant="success" className="w-100 rounded-pill">
            เข้าสู่ระบบ
          </Button>
        </Form>

        <div className="text-center mt-3">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </div>
      </Card>
    </Container>
  );
}
