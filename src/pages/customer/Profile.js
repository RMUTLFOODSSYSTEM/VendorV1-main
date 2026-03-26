import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Spinner, Alert, ListGroup,
  Modal, Form, Button, InputGroup
} from "react-bootstrap";

/** โปรไฟล์ลูกค้า: เหมือนฝั่งร้านค้า แต่ไม่มีชื่อร้าน */
export default function CustomerProfile() {
  // อีเมลของผู้ใช้ปัจจุบัน (ลูกค้า)
  const email = useMemo(() => localStorage.getItem("userEmail") || "", []);

  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState("");
  const [data, setData]         = useState(null); // {email, username, phone, createdAt}

  // modal states
  const [showEdit, setShowEdit] = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  // form states
  const [editForm, setEditForm] = useState({ username: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!email) {
      setLoading(false);
      setData(null);
      return;
    }
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        // 1) ลองอ่านจาก localStorage ก่อน (แคช)
        const cacheKey = cacheKeyFor(email);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
          return;
        }

        // 2) MOCK: สร้างข้อมูลตั้งต้นจากอีเมล (ไม่มี backend)
        await delay(300);
        const json = fallbackProfileFromEmail(email);
        // เซฟแคช
        localStorage.setItem(cacheKey, JSON.stringify(json));
        setData(json);
      } catch (e) {
        setErr(e.message || "โหลดข้อมูลไม่สำเร็จ");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [email]);

  // ---------- แก้ไขโปรไฟล์ ----------
  const openEdit = () => {
    if (data) setEditForm({ username: data.username || "", phone: data.phone || "" });
    setSaveMsg("");
    setShowEdit(true);
  };

  const saveProfile = async (e) => {
    e?.preventDefault?.();
    setSavingProfile(true);
    setSaveMsg("");
    try {
      await delay(400);
      const newData = { ...data, username: editForm.username.trim(), phone: (editForm.phone || "").trim() };
      setData(newData);
      localStorage.setItem(cacheKeyFor(email), JSON.stringify(newData));
      setShowEdit(false);
    } catch {
      setSaveMsg("บันทึกไม่สำเร็จ");
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------- เปลี่ยนรหัสผ่าน ----------
  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });

    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      return setPwdMsg({ type: "danger", text: "กรุณากรอกข้อมูลให้ครบ" });
    }
    if (pwdForm.next.length < 6) {
      return setPwdMsg({ type: "danger", text: "รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร" });
    }
    if (pwdForm.next !== pwdForm.confirm) {
      return setPwdMsg({ type: "danger", text: "รหัสผ่านใหม่และยืนยันไม่ตรงกัน" });
    }

    setSavingPwd(true);
    try {
      await delay(500);

      // จัดเก็บรหัสผ่านของลูกค้าใน localStorage (เฉพาะ dev/mock)
      const customers = readCustomers();
      const idx = customers.findIndex(
        u => String(u.email).toLowerCase() === String(email).toLowerCase()
      );
      if (idx === -1) {
        setPwdMsg({ type: "danger", text: "ไม่พบบัญชีผู้ใช้" });
      } else if (String(customers[idx].password) !== String(pwdForm.current)) {
        setPwdMsg({ type: "danger", text: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
      } else {
        customers[idx].password = pwdForm.next;
        localStorage.setItem("customers", JSON.stringify(customers));
        setPwdMsg({ type: "success", text: "เปลี่ยนรหัสผ่านเรียบร้อย" });
        setShowPwd(false);
      }
      setPwdForm({ current: "", next: "", confirm: "" });
    } finally {
      setSavingPwd(false);
    }
  };

  if (!email) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="mb-0">กรุณาเข้าสู่ระบบก่อน เพื่อดูโปรไฟล์</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={8}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">โปรไฟล์ลูกค้า</h5>
                {!loading && !err && data && (
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="rounded-pill px-3" onClick={openEdit}>
                      แก้ไขข้อมูล
                    </Button>
                    <Button variant="outline-success" className="rounded-pill px-3" onClick={() => setShowPwd(true)}>
                      เปลี่ยนรหัสผ่าน
                    </Button>
                  </div>
                )}
              </div>

              {loading && (
                <div className="d-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" />
                  <span>กำลังโหลดข้อมูล...</span>
                </div>
              )}

              {!loading && err && <Alert variant="danger" className="mb-0">{err}</Alert>}

              {!loading && !err && data && (
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>อีเมล: </strong>{data.email}</ListGroup.Item>
                  <ListGroup.Item><strong>ชื่อผู้ใช้: </strong>{data.username || "-"}</ListGroup.Item>
                  <ListGroup.Item><strong>เบอร์โทร: </strong>{data.phone || "-"}</ListGroup.Item>
                  {data.createdAt && (
                    <ListGroup.Item>
                      <strong>สมัครเมื่อ: </strong>{new Date(data.createdAt).toLocaleString()}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== Modal: แก้ไขข้อมูล ===== */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลโปรไฟล์</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveProfile}>
          <Modal.Body>
            {saveMsg && <Alert variant="info" className="py-2">{saveMsg}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>อีเมล (อ่านอย่างเดียว)</Form.Label>
              <Form.Control value={email} disabled />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>ชื่อผู้ใช้</Form.Label>
                  <Form.Control
                    value={editForm.username}
                    onChange={(e) => setEditForm(s => ({ ...s, username: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>เบอร์โทร</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>+66</InputGroup.Text>
                    <Form.Control
                      value={editForm.phone}
                      onChange={(e) => setEditForm(s => ({ ...s, phone: e.target.value }))}
                      placeholder="08x-xxx-xxxx"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>ยกเลิก</Button>
            <Button type="submit" variant="success" disabled={savingProfile}>
              {savingProfile ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ===== Modal: เปลี่ยนรหัสผ่าน ===== */}
      <Modal show={showPwd} onHide={() => setShowPwd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>เปลี่ยนรหัสผ่าน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={changePassword}>
          <Modal.Body>
            {pwdMsg.text && (
              <Alert variant={pwdMsg.type === "success" ? "success" : "danger"} className="py-2">
                {pwdMsg.text}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>รหัสผ่านปัจจุบัน</Form.Label>
              <Form.Control
                type="password"
                value={pwdForm.current}
                onChange={(e) => setPwdForm(s => ({ ...s, current: e.target.value }))}
                required
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>รหัสผ่านใหม่</Form.Label>
                  <Form.Control
                    type="password"
                    value={pwdForm.next}
                    onChange={(e) => setPwdForm(s => ({ ...s, next: e.target.value }))}
                    minLength={6}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>ยืนยันรหัสผ่านใหม่</Form.Label>
                  <Form.Control
                    type="password"
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm(s => ({ ...s, confirm: e.target.value }))}
                    minLength={6}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPwd(false)}>ยกเลิก</Button>
            <Button type="submit" variant="outline-success" disabled={savingPwd}>
              {savingPwd ? "กำลังเปลี่ยน..." : "อัปเดตรหัสผ่าน"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

/* ---------- helpers ---------- */
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const cacheKeyFor = (email) => `profile:customer:${String(email).toLowerCase()}`;

// fallback สร้างโปรไฟล์เริ่มต้นจากอีเมล
function fallbackProfileFromEmail(email) {
  const nameGuess =
    localStorage.getItem("customerName") || String(email).split("@")[0] || "user";
  return {
    email,
    username: nameGuess,
    phone: "-",
    createdAt: new Date().toISOString(),
  };
}

function readCustomers() {
  try {
    return JSON.parse(localStorage.getItem("customers") || "[]");
  } catch {
    return [];
  }
}
