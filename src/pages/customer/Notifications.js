import { Container, Card, ListGroup, Badge, Alert } from "react-bootstrap";

export default function CustomerNotifications() {
  // อ่านออเดอร์ทั้งหมดที่เคยสั่ง (ถูกบันทึกตอน Checkout)
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (!orders.length) {
    return (
      <Container className="py-4 py-md-5">
        <Alert variant="secondary">ยังไม่มีการแจ้งเตือนคำสั่งซื้อ</Alert>
      </Container>
    );
  }

  const fmtBaht = (n) => `฿ ${Number(n || 0).toLocaleString()}`;

  return (
    <Container className="py-4 py-md-5">
      <h5 className="fw-bold mb-3">การแจ้งเตือนคำสั่งซื้อ</h5>

      <div className="d-flex flex-column gap-3">
        {orders.map((o) => {
          const status = o.paid ? "ชำระเงินแล้ว" : "รอชำระเงิน";
          const statusVariant = o.paid ? "success" : "warning";

          return (
            <Card key={o.id} className="border-0 rounded-4 shadow-sm">
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">
                    Order: <span className="text-muted">#{o.id}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={statusVariant}>{status}</Badge>
                    {o.paidMethod && (
                      <Badge bg="light" text="dark">
                        วิธีชำระ: {methodName(o.paidMethod)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-muted small mb-3">
                  วันที่สั่ง: {new Date(o.createdAt).toLocaleString()}
                </div>

                <ListGroup variant="flush" className="mb-3">
                  {o.items?.map((it) => (
                    <ListGroup.Item
                      key={`${o.id}-${it.id}`}
                      className="d-flex justify-content-between"
                    >
                      <div>
                        {it.name} <Badge bg="light" text="dark">x{it.qty}</Badge>
                      </div>
                      <div>{fmtBaht(it.price * it.qty)}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="bg-light p-3 rounded-4">
                  <div className="d-flex justify-content-between">
                    <span>ยอดสินค้า</span>
                    <span>{fmtBaht(o.subtotal)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span>{fmtBaht(o.total)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

function methodName(code) {
  switch (code) {
    case "TRANSFER": return "โอนเงินผ่านธนาคาร";
    case "CARD": return "บัตรเครดิต/เดบิต";
    case "QR": return "QR Code";
    default: return code || "-";
  }
}
