import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Spinner, Alert, ListGroup,
  Modal, Form, Button, InputGroup
} from "react-bootstrap";

export default function Profile({ authed, userEmail }) {
  // ดึงจาก props หรือสำรองจาก localStorage
  const email = useMemo(() => userEmail || localStorage.getItem("userEmail") || "", [userEmail]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  // ====== Modal states ======
  const [showEdit, setShowEdit] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // ฟอร์มแก้ไขโปรไฟล์
  const [editForm, setEditForm] = useState({ username: "", shopName: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // ฟอร์มเปลี่ยนรหัสผ่าน
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!email) {
      setLoading(false);
      setData(null);
      return;
    }

    const controller = new AbortController();
    const fetchProfile = async () => {
      setLoading(true);
      setErr("");
      try {
        // ===== TODO: เรียก API จริงที่นี่ =====
        // const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`, { signal: controller.signal });
        // if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // const json = await res.json();

        // ===== โหลดจาก localStorage ก่อน, ถ้าไม่มีค่อย fallback =====
        await new Promise(r => setTimeout(r, 400));
        let json = getStoredProfile(email);
        if (!json) {
          json = mockGetProfileByEmail(email) || fallbackProfileFromEmail(email);
        }

        setData(json);
      } catch (e) {
        setErr(e.message || "โหลดข้อมูลไม่สำเร็จ");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [email]);

  // เปิด modal แก้ไข พร้อมโหลดค่าเริ่มต้นจาก data
  const openEdit = () => {
    if (data) setEditForm({ username: data.username || "", shopName: data.shopName || "", phone: data.phone || "" });
    setSaveMsg("");
    setShowEdit(true);
  };

  const saveProfile = async (e) => {
    e?.preventDefault?.();
    setSavingProfile(true);
    setSaveMsg("");
    try {
      // TODO: PUT /api/profile  (body = { email, ...editForm })
      await new Promise(r => setTimeout(r, 500));
      // อัปเดต state ในหน้า + บันทึกลง localStorage ให้จำค่า
      setData(d => {
        const merged = { ...d, ...editForm };
        saveStoredProfile(email, merged);   // <-- บันทึกถาวรตามอีเมล
        return merged;
      });
      setSaveMsg("บันทึกข้อมูลเรียบร้อย");
      setShowEdit(false);
    } catch (e) {
      setSaveMsg("บันทึกไม่สำเร็จ");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });

    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      setPwdMsg({ type: "danger", text: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }
    if (pwdForm.next.length < 6) {
      setPwdMsg({ type: "danger", text: "รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร" });
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdMsg({ type: "danger", text: "รหัสผ่านใหม่และยืนยันไม่ตรงกัน" });
      return;
    }

    setSavingPwd(true);
    try {
      // TODO: POST /api/change-password  (body = { email, ...pwdForm })
      await new Promise(r => setTimeout(r, 600));
      setPwdForm({ current: "", next: "", confirm: "" });
      setPwdMsg({ type: "success", text: "เปลี่ยนรหัสผ่านเรียบร้อย" });
      setShowPwd(false);
    } catch (e) {
      setPwdMsg({ type: "danger", text: "เปลี่ยนรหัสผ่านไม่สำเร็จ" });
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
                <h5 className="fw-bold mb-0">โปรไฟล์ผู้ใช้</h5>
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
                  <ListGroup.Item><strong>ชื่อร้าน: </strong>{data.shopName || "-"}</ListGroup.Item>
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

      {/* ===== Modal: แก้ไขข้อมูลโปรไฟล์ ===== */}
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
                  <Form.Label>ชื่อร้าน</Form.Label>
                  <Form.Control
                    value={editForm.shopName}
                    onChange={(e) => setEditForm(s => ({ ...s, shopName: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
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

/* ===== MOCK ชั่วคราว (ลบทิ้งเมื่อมี API จริง) ===== */
function mockGetProfileByEmail(email) {
  const db = [
    {
      email: "owner@example.com",
      username: "shopowner01",
      shopName: "RMUTL Mini Shop",
      phone: "081-234-5678",
      createdAt: "2024-08-01T08:30:00Z",
    },
    {
      email: "you@example.com",
      username: "yourname",
      shopName: "Your Shop",
      phone: "089-999-9999",
      createdAt: "2024-09-10T10:00:00Z",
    },
  ];
  return db.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

// Fallback: สร้างข้อมูลพื้นฐานจากอีเมลเมื่อล็อกอิน (ถ้ายังไม่มีใน mock/API)
function fallbackProfileFromEmail(email) {
  const nameGuess = String(email).split("@")[0] || "user";
  return {
    email,
    username: nameGuess,
    shopName: `${nameGuess}'s Shop`,
    phone: "-",
    createdAt: new Date().toISOString(),
  };
}

/* ===== Local persistence (เก็บชั่วคราวก่อนมี API จริง) ===== */
const profileKey = (email) => `profile:${String(email).toLowerCase()}`;

function getStoredProfile(email) {
  try {
    const raw = localStorage.getItem(profileKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredProfile(email, obj) {
  try {
    localStorage.setItem(profileKey(email), JSON.stringify(obj));
  } catch {}
}
