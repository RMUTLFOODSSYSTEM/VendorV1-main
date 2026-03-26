import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // TODO: เรียก API จริงเพื่อส่งลิงก์รีเซ็ตรหัสผ่าน
      await new Promise(r => setTimeout(r, 800));
      setMsg("เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว");
    } catch {
      setMsg("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm rounded-4" style={{ maxWidth: 400, width: "100%" }}>
        <h4 className="text-center mb-3">ลืมรหัสผ่าน</h4>

        {msg && <Alert variant="info">{msg}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>อีเมลของคุณ</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 rounded-pill" disabled={loading}>
            {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
