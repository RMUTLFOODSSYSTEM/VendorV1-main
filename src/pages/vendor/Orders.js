// src/pages/Orders.js
import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Table, Button, Badge,
  InputGroup, Form, Modal
} from "react-bootstrap";

/** ====== สถานะออเดอร์ที่รองรับ ====== */
const ORDER_STATUS = ["pending", "paid", "preparing", "completed", "cancelled"];

/** Badge สีตามสถานะ */
const StatusBadge = ({ status }) => {
  const map = {
    pending: "secondary",
    paid: "primary",
    preparing: "warning",
    completed: "success",
    cancelled: "danger",
  };
  return <Badge bg={map[status] || "secondary"} className="text-uppercase">{status}</Badge>;
};

/** Mock เริ่มต้น (ใช้ครั้งแรกเท่านั้น ถ้า localStorage ยังว่าง) */
const initialMock = [
  {
    id: "ORD-24001",
    customer: "สมชาย ใจดี",
    phone: "081-111-2222",
    items: [
      { name: "ข้าวกะเพรา", qty: 1, price: 45 },
      { name: "ชาเขียวเย็น", qty: 1, price: 25 },
    ],
    total: 70,
    status: "pending",
    createdAt: "2025-08-20T09:20:00Z",
    note: "ไม่ใส่เผ็ด",
  },
  {
    id: "ORD-24002",
    customer: "ศิริพร มีสุข",
    phone: "089-333-4444",
    items: [{ name: "ข้าวผัดกุ้ง", qty: 1, price: 55 }],
    total: 55,
    status: "paid",
    createdAt: "2025-08-20T10:10:00Z",
    note: "",
  },
  {
    id: "ORD-24003",
    customer: "วีรยุทธ สายใจ",
    phone: "082-555-6666",
    items: [
      { name: "ข้าวกะเพรา", qty: 2, price: 45 },
      { name: "น้ำเปล่า", qty: 1, price: 10 },
    ],
    total: 100,
    status: "preparing",
    createdAt: "2025-08-21T11:00:00Z",
    note: "รับที่โรงอาหาร A",
  },
];

/** คีย์ localStorage */
const LS_KEY = "orders:data:v1";

/** โหลด/บันทึก localStorage */
const loadOrders = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveOrders = (orders) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(orders));
  } catch {}
};

export default function Orders() {
  const [orders, setOrders] = useState(() => loadOrders() || initialMock);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal รายละเอียด
  const [showDetail, setShowDetail] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // เพจิเนชันง่าย ๆ
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // บันทึกทุกครั้งที่ orders เปลี่ยน
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  // ค้นหา + กรองสถานะ
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return orders.filter((o) => {
      const byStatus = statusFilter === "all" ? true : o.status === statusFilter;
      const byKw =
        !kw ||
        o.id.toLowerCase().includes(kw) ||
        (o.customer || "").toLowerCase().includes(kw) ||
        (o.phone || "").toLowerCase().includes(kw);
      return byStatus && byKw;
    });
  }, [orders, q, statusFilter]);

  // จัดเรียงให้รายการใหม่ขึ้นก่อน (createdAt ใหม่กว่าอยู่บน)
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filtered]);

  // ตัดหน้า
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  useEffect(() => {
    // ถ้าเปลี่ยน filter/ค้นหา แล้ว page เกิน ให้รีเซ็ตกลับหน้า 1
    setPage(1);
  }, [q, statusFilter]);

  // เปิดดูรายละเอียด
  const openDetail = (order) => {
    setActiveOrder(order);
    setShowDetail(true);
  };

  // เปลี่ยนสถานะตามขั้นตอน
  const advanceStatus = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nextMap = { pending: "paid", paid: "preparing", preparing: "completed" };
        const next = nextMap[o.status] || o.status;
        return { ...o, status: next };
      })
    );
  };

  const cancelOrder = (id) => {
    if (!window.confirm("ยกเลิกออเดอร์นี้ใช่หรือไม่?")) return;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={11}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              {/* แถวบน: ค้นหา + สถานะ + สรุปนับ */}
              <Row className="g-2 align-items-center mb-3">
                <Col xs={12} md>
                  <InputGroup>
                    <InputGroup.Text>ค้นหา</InputGroup.Text>
                    <Form.Control
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="เลขออเดอร์ / ชื่อลูกค้า / เบอร์โทร"
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md="auto">
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="pending">รอยืนยัน (pending)</option>
                    <option value="paid">ชำระเงินแล้ว (paid)</option>
                    <option value="preparing">กำลังเตรียม (preparing)</option>
                    <option value="completed">สำเร็จ (completed)</option>
                    <option value="cancelled">ยกเลิก (cancelled)</option>
                  </Form.Select>
                </Col>
                <Col xs="auto" className="text-muted small">
                  ทั้งหมด {sorted.length} รายการ
                </Col>
              </Row>

              {/* ตารางรายการสั่งซื้อ */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 110 }}>เลขออเดอร์</th>
                      <th>ลูกค้า</th>
                      <th style={{ width: 110 }} className="text-center">ยอดรวม (฿)</th>
                      <th style={{ width: 140 }} className="text-center">สถานะ</th>
                      <th style={{ width: 180 }}>เวลา</th>
                      <th style={{ width: 210 }} className="text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">ไม่พบรายการ</td>
                      </tr>
                    ) : (
                      pageData.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-semibold">{o.id}</td>
                          <td>
                            <div className="fw-semibold">{o.customer}</div>
                            <div className="text-muted small">{o.phone}</div>
                          </td>
                          <td className="text-center">{o.total.toLocaleString()}</td>
                          <td className="text-center">
                            <StatusBadge status={o.status} />
                          </td>
                          <td>
                            <div>{new Date(o.createdAt).toLocaleString()}</div>
                            {o.note && <div className="text-muted small">หมายเหตุ: {o.note}</div>}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <Button size="sm" variant="outline-primary" onClick={() => openDetail(o)}>
                                รายละเอียด
                              </Button>

                              {/* ปุ่มเดินหน้าเฉพาะสถานะที่ยังไม่จบ */}
                              {o.status !== "completed" && o.status !== "cancelled" && (
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => advanceStatus(o.id)}
                                >
                                  {o.status === "pending" && "ยืนยันชำระ"}
                                  {o.status === "paid" && "เริ่มเตรียม"}
                                  {o.status === "preparing" && "เสร็จสิ้น"}
                                </Button>
                              )}

                              {/* ปุ่มยกเลิก เฉพาะถ้ายังไม่จบ */}
                              {o.status !== "completed" && o.status !== "cancelled" && (
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => cancelOrder(o.id)}
                                >
                                  ยกเลิก
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* เพจิเนชันแบบง่าย */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="text-muted small">
                  หน้า {page} / {totalPages}
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹ ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    ถัดไป ›
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal รายละเอียดออเดอร์ */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดออเดอร์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeOrder && (
            <>
              <div className="mb-2"><strong>เลขออเดอร์:</strong> {activeOrder.id}</div>
              <div className="mb-2"><strong>ลูกค้า:</strong> {activeOrder.customer} ({activeOrder.phone})</div>
              <div className="mb-2"><strong>สถานะ:</strong> <StatusBadge status={activeOrder.status} /></div>
              <div className="mb-2"><strong>เวลา:</strong> {new Date(activeOrder.createdAt).toLocaleString()}</div>
              {activeOrder.note && (
                <div className="mb-2"><strong>หมายเหตุ:</strong> {activeOrder.note}</div>
              )}

              <hr />
              <div className="fw-semibold mb-2">รายการอาหาร</div>
              <Table size="sm" bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>ชื่อเมนู</th>
                    <th style={{ width: 70 }} className="text-center">จำนวน</th>
                    <th style={{ width: 90 }} className="text-end">ราคา (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-end">{(it.price * it.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={2} className="text-end">รวม</th>
                    <th className="text-end">{activeOrder.total.toLocaleString()}</th>
                  </tr>
                </tfoot>
              </Table>
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
