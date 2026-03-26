import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";

export default function CustomerRegister({ onLogin }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setErr(""); setMsg("");

    if (form.password !== form.confirm) {
      setErr("รหัสผ่านและยืนยันรหัสไม่ตรงกัน");
      return;
    }

    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const existed = customers.find(
      (u) => String(u.email).toLowerCase().trim() === String(form.email).toLowerCase().trim()
    );
    if (existed) {
      setErr("อีเมลนี้ถูกใช้แล้ว");
      return;
    }

    customers.push({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      phone: form.phone?.trim() || ""
    });
    localStorage.setItem("customers", JSON.stringify(customers));

    // ✅ แจ้ง App ให้รู้ว่า login แล้ว (บทบาทลูกค้า)
    if (onLogin) onLogin(form.email, "customer");
    else {
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("role", "customer");
      localStorage.setItem("customerName", form.name);
    }

    setMsg("สมัครสำเร็จ กำลังพาไปหน้าเมนู...");
    setTimeout(()=> nav("/shop"), 500);
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="p-4 rounded-4 shadow-sm" style={{maxWidth:480, width:"100%"}}>
        <h4 className="text-center mb-3">สมัครสมาชิก</h4>
        {err && <Alert variant="danger">{err}</Alert>}
        {msg && <Alert variant="success">{msg}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>ชื่อผู้ใช้</Form.Label>
            <Form.Control name="name" value={form.name} onChange={onChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>อีเมล</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={onChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>เบอร์โทรศัพท์</Form.Label>
            <InputGroup>
              <InputGroup.Text>+66</InputGroup.Text>
              <Form.Control type="tel" name="phone" value={form.phone} onChange={onChange} pattern="[0-9]{9,10}" required />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={onChange} minLength={6} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
            <Form.Control type="password" name="confirm" value={form.confirm} onChange={onChange} minLength={6} required />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 rounded-pill">สมัครสมาชิก</Button>
        </Form>

        <div className="text-center mt-3">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </Card>
    </Container>
  );
}
