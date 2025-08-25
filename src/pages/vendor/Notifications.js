// src/pages/Notifications.js
import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Badge, Button, Form, InputGroup, ListGroup, Modal
} from "react-bootstrap";

/** ---- ประเภทแจ้งเตือนที่รองรับ ---- */
const TYPES = ["order", "payment", "system"];

/** ---- Mock เริ่มต้น (ใช้ครั้งแรกเมื่อ localStorage ยังว่าง) ---- */
const initialMock = [
  {
    id: "NT-001",
    type: "order",
    title: "ออเดอร์ใหม่ ORD-24004",
    message: "ลูกค้า: นฤมล โทร 089-123-4567",
    createdAt: "2025-08-21T12:35:00Z",
    read: false,
  },
  {
    id: "NT-002",
    type: "payment",
    title: "ชำระเงินสำเร็จ ORD-24002",
    message: "ลูกค้า: ศิริพร มีสุข ยอด 55 บาท",
    createdAt: "2025-08-20T10:15:00Z",
    read: true,
  },
  {
    id: "NT-003",
    type: "system",
    title: "อัปเดตระบบสำเร็จ",
    message: "ปรับปรุงความเสถียรของการแจ้งเตือน",
    createdAt: "2025-08-19T08:00:00Z",
    read: true,
  },
];

const LS_KEY = "notifications:data:v1";

/** ---- utils ---- */
const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveToLS = (rows) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {}
};

const typeBadge = (t) => {
  const map = { order: "success", payment: "primary", system: "secondary" };
  return <Badge bg={map[t] || "secondary"} className="text-uppercase">{t}</Badge>;
};

const timeText = (iso) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

export default function Notifications() {
  const [items, setItems] = useState(() => loadFromLS() || initialMock);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");   // all | unread | read
  const [type, setType] = useState("all");       // all | order | payment | system

  // modal สำหรับรายละเอียด
  const [showDetail, setShowDetail] = useState(false);
  const [active, setActive] = useState(null);

  // บันทึกทุกครั้งที่เปลี่ยน
  useEffect(() => {
    saveToLS(items);
  }, [items]);

  // สรุปตัวเลข
  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items]);

  // ค้นหา + กรอง
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return items.filter((n) => {
      const byKw =
        !kw ||
        (n.title || "").toLowerCase().includes(kw) ||
        (n.message || "").toLowerCase().includes(kw) ||
        (n.id || "").toLowerCase().includes(kw);
      const byStatus =
        status === "all" ? true : status === "unread" ? !n.read : n.read;
      const byType = type === "all" ? true : n.type === type;
      return byKw && byStatus && byType;
    });
  }, [items, q, status, type]);

  // เรียงใหม่ก่อนเก่า
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filtered]);

  // action
  const markRead = (id, read = true) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read } : n)));
  };
  const removeOne = (id) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };
  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };
  const clearAll = () => {
    if (!window.confirm("ลบการแจ้งเตือนทั้งหมดใช่หรือไม่?")) return;
    setItems([]);
  };

  const openDetail = (n) => {
    setActive(n);
    setShowDetail(true);
    if (!n.read) markRead(n.id, true);
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              {/* หัว + ปุ่มลัด */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h5 className="fw-bold mb-0">
                  การแจ้งเตือน{" "}
                  <Badge bg={unreadCount ? "danger" : "secondary"} pill>
                    ยังไม่อ่าน {unreadCount}
                  </Badge>
                </h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-success" size="sm" onClick={markAllRead} disabled={!items.length}>
                    ทำทั้งหมดเป็นอ่านแล้ว
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={clearAll} disabled={!items.length}>
                    ลบทั้งหมด
                  </Button>
                </div>
              </div>

              {/* แถวกรอง */}
              <Row className="g-2 align-items-center mb-3">
                <Col xs={12} md>
                  <InputGroup>
                    <InputGroup.Text>ค้นหา</InputGroup.Text>
                    <Form.Control
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="หัวข้อ / เนื้อหา / รหัส"
                    />
                  </InputGroup>
                </Col>
                <Col xs={6} md="auto">
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="unread">ยังไม่อ่าน</option>
                    <option value="read">อ่านแล้ว</option>
                  </Form.Select>
                </Col>
                <Col xs={6} md="auto">
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="all">ทุกประเภท</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </Form.Select>
                </Col>
              </Row>

              {/* รายการแจ้งเตือน */}
              <div className="table-responsive">
                <ListGroup variant="flush" as="div" className="mb-0">
                  {sorted.length === 0 ? (
                    <div className="text-center text-muted py-4">ไม่มีการแจ้งเตือน</div>
                  ) : (
                    sorted.map(n => (
                      <ListGroup.Item
                        key={n.id}
                        className={`py-3 ${!n.read ? "bg-light" : ""}`}
                        action
                        onClick={() => openDetail(n)}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              {typeBadge(n.type)}
                              <span className={`fw-semibold ${!n.read ? "text-dark" : ""}`}>
                                {n.title}
                              </span>
                              {!n.read && <Badge bg="danger" pill>ใหม่</Badge>}
                            </div>
                            <div className="text-muted">{n.message}</div>
                            <div className="text-muted small mt-1">{timeText(n.createdAt)}</div>
                          </div>
                          {/* ปุ่มเร็ว */}
                          <div className="d-flex flex-column gap-2" style={{ minWidth: "120px" }}>
                            <Button
                              variant={n.read ? "outline-secondary" : "success"}
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); markRead(n.id, !n.read ? true : false); }}
                            >
                              {n.read ? "ทำเป็นยังไม่อ่าน" : "ทำเป็นอ่านแล้ว"}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); removeOne(n.id); }}
                            >
                              ลบ
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal รายละเอียด */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดการแจ้งเตือน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {active && (
            <>
              <div className="mb-2"><strong>รหัส:</strong> {active.id}</div>
              <div className="mb-2"><strong>ประเภท:</strong> {active.type}</div>
              <div className="mb-2"><strong>หัวข้อ:</strong> {active.title}</div>
              <div className="mb-2"><strong>ข้อความ:</strong> {active.message}</div>
              <div className="mb-2"><strong>เวลา:</strong> {timeText(active.createdAt)}</div>
              <div className="mb-2"><strong>สถานะ:</strong> {active.read ? "อ่านแล้ว" : "ยังไม่อ่าน"}</div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>ปิด</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
