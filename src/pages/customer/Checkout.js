// src/pages/customer/Checkout.js
import { useEffect, useState, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, Form, Button, Badge, Alert, Image } from "react-bootstrap";
import { useCart } from "../../context/CartContext";

// เดโมข้อมูลธนาคาร
const BANK_INFO = {
  name: "กรุงไทย (Krungthai)",
  accountName: "RMUTL Foods",
  accountNo: "123-4-56789-0",
};

// เดโม QR (ถ้ามีไฟล์ภาพจริง เปลี่ยน src ได้)
const QR_SVG = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
  <rect width='100%' height='100%' fill='white'/>
  <rect x='10' y='10' width='200' height='200' fill='black'/>
  <rect x='20' y='20' width='180' height='180' fill='white'/>
  <rect x='40' y='40' width='40' height='40' fill='black'/>
  <rect x='140' y='40' width='40' height='40' fill='black'/>
  <rect x='40' y='140' width='40' height='40' fill='black'/>
  <rect x='140' y='140' width='40' height='40' fill='black'/>
  <rect x='90' y='90' width='40' height='40' fill='black'/>
</svg>`;

export default function Checkout() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { clear } = useCart();

  // ✅ hooks ต้องอยู่ก่อน conditional return เสมอ
  const [payment, setPayment] = useState("TRANSFER"); // TRANSFER | CARD | QR
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  // ใช้ guard variable แทนการ return ก่อนประกาศ hooks
  const hasItems = !!state?.items?.length;

  // ถ้าเข้าตรงๆให้เด้งกลับตะกร้า
  useEffect(() => {
    if (!hasItems) nav("/shop/orders", { state: { ok: true } });
  }, [hasItems, nav]);

  // ถ้าไม่มีรายการ ให้ไม่ render เนื้อหา (หลังจาก hooks ประกาศแล้ว)
  if (!hasItems) return null;

  const { items, subtotal,  total, pickupAt } = state;

  const onChangeProof = (e) => {
    const f = e.target.files?.[0] || null;
    setProof(f);
    if (f) {
      const r = new FileReader();
      r.onload = () => setPreview(r.result);
      r.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();
     clear();

        alert("✅ ชำระเงินสำเร็จ!");
        nav("/shop/orders");

    // ต้องแนบสลิปเมื่อโอน/QR
    if ((payment === "TRANSFER" || payment === "QR") && !proof) {
      setMsg({ type: "danger", text: "กรุณาแนบหลักฐานการชำระเงิน" });
      return;
    }

    setSaving(true);
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.unshift({
        id: Date.now(),
        items,
        subtotal,
        total,
        pickupAt,
        paid: true,
        paidMethod: payment,
        proofPreview: preview || null, // เดโมเก็บ dataURL
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      clear();
      nav("/shop/orders", { state: { ok: true } });
    } catch {
      setMsg({ type: "danger", text: "บันทึกไม่สำเร็จ กรุณาลองใหม่" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4 py-md-5">
      <Card className="border-0 rounded-4 shadow-sm">
        <Card.Body className="p-3 p-md-4">
          <h5 className="fw-bold mb-3">ชำระเงิน</h5>

          <div className="row g-3">
            {/* สรุปรายการ */}
            <div className="col-lg-7">
              <h6 className="fw-semibold">รายการสั่งซื้อ</h6>
              <ListGroup variant="flush" className="mb-3">
                {items.map((it) => (
                  <ListGroup.Item key={it.id} className="d-flex justify-content-between">
                    <div>
                      {it.name} <Badge bg="light" text="dark">x{it.qty}</Badge>
                    </div>
                    <div>฿ {(it.price * it.qty).toLocaleString()}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="bg-light p-3 rounded-4 mb-3">
                <div className="d-flex justify-content-between">
                  <span>ยอดสินค้า</span>
                  <span>฿ {subtotal.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span>฿ {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* วิธีจ่าย + แนบสลิป */}
            <div className="col-lg-5">
              <h6 className="fw-semibold">วิธีการชำระเงิน</h6>

              {msg.text && <Alert variant={msg.type === "success" ? "success" : "danger"}>{msg.text}</Alert>}

              <Form onSubmit={placeOrder}>
                <Form.Check
                  type="radio"
                  id="pay-transfer"
                  name="payment"
                  value="TRANSFER"
                  label="โอนเงินผ่านธนาคาร"
                  checked={payment === "TRANSFER"}
                  onChange={() => setPayment("TRANSFER")}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="pay-card"
                  name="payment"
                  value="CARD"
                  label="ชำระผ่านบัตรเครดิต/เดบิต"
                  checked={payment === "CARD"}
                  onChange={() => setPayment("CARD")}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="pay-qr"
                  name="payment"
                  value="QR"
                  label="ชำระผ่าน QR Code"
                  checked={payment === "QR"}
                  onChange={() => setPayment("QR")}
                  className="mb-3"
                />

                {payment === "TRANSFER" && (
                  <Card className="border rounded-3 mb-3">
                    <Card.Body>
                      <div className="fw-semibold mb-1">{BANK_INFO.name}</div>
                      <div>ชื่อบัญชี: {BANK_INFO.accountName}</div>
                      <div>เลขที่บัญชี: {BANK_INFO.accountNo}</div>
                      <div className="text-muted small mt-2">โอนแล้วโปรดแนบสลิปเพื่อยืนยัน</div>
                    </Card.Body>
                  </Card>
                )}

                {payment === "QR" && (
                  <Card className="border rounded-3 mb-3">
                    <Card.Body className="text-center">
                      <div className="fw-semibold mb-2">สแกน QR เพื่อชำระเงิน</div>
                      <Image src={QR_SVG} alt="QR" width={180} height={180} />
                      <div className="text-muted small mt-2">หลังชำระแล้วโปรดแนบสลิปเพื่อยืนยัน</div>
                    </Card.Body>
                  </Card>
                )}

                {(payment === "TRANSFER" || payment === "QR") && (
                  <Form.Group className="mb-3">
                    <Form.Label>แนบหลักฐานการชำระเงิน (รูปภาพ)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={onChangeProof} />
                    {preview && (
                      <div className="mt-2">
                        <div className="small text-muted mb-1">ตัวอย่าง</div>
                        <Image src={preview} thumbnail style={{ maxWidth: 240 }} />
                      </div>
                    )}
                  </Form.Group>
                )}

                <div className="mb-3">
                  <small className="text-muted">
                    เวลารับสินค้า: {new Date(pickupAt).toLocaleString()}
                  </small>
                </div>

                <Button type="submit" variant="success" className="w-100 rounded-pill" disabled={saving}>
                  {saving ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
                </Button>
              </Form>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
