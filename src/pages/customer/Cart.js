// src/pages/customer/Cart.js
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, update, remove, subtotal } = useCart();
  const [pickupAt, setPickupAt] = useState(getDefaultPickup());
  const nav = useNavigate();

  const hasItems = items.length > 0;
  const canCheckout = hasItems && pickupAt;

  const total = useMemo(() => subtotal, [subtotal]);


  const goCheckout = () => {
    if (!canCheckout) return;
    // ✅ ส่ง state ไปหน้า Checkout
    nav("/shop/checkout", { state: { items, subtotal, total, pickupAt } });
  };

  return (
    <Container className="py-4 py-md-5">
      <h4 className="fw-bold mb-3">ตะกร้าสินค้า</h4>

      {!hasItems && <Alert variant="secondary">ยังไม่มีสินค้าในตะกร้า</Alert>}

      {hasItems && (
        <>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>รายการ</th>
                  <th className="text-end">ราคา/หน่วย</th>
                  <th className="text-center">จำนวน</th>
                  <th className="text-end">รวม</th>
                  <th className="text-center">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id}>
                    <td>{idx + 1}</td>
                    <td>{it.name}</td>
                    <td className="text-end">฿ {it.price.toLocaleString()}</td>
                    <td className="text-center">
                      <InputGroup className="qty-group flex-nowrap mx-auto">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="qty-btn"
                          onClick={() => update(it.id, Math.max(1, it.qty - 1))}
                        >
                          –
                        </Button>

                        <Form.Control
                          value={it.qty}
                          onChange={(e) => {
                            const q = Math.max(1, Number(e.target.value) || 1);
                            update(it.id, q);
                          }}
                          className="qty-input text-center"
                          inputMode="numeric"
                        />

                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="qty-btn"
                          onClick={() => update(it.id, it.qty + 1)}
                        >
                          +
                        </Button>
                      </InputGroup>

                    </td>
                    <td className="text-end">฿ {(it.price * it.qty).toLocaleString()}</td>
                    <td className="text-center">
                      <Button size="sm" variant="outline-danger" onClick={() => remove(it.id)}>
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* เวลารับสินค้า */}
          <div className="bg-light p-3 rounded-4 mb-3">
            <Form.Label className="fw-semibold">เลือกเวลารับสินค้า</Form.Label>
            <Form.Control
              type="datetime-local"
              value={pickupAt}
              onChange={(e) => setPickupAt(e.target.value)}
              min={minDateTimeLocal()}
              className="pickup-input"
            />
            <Form.Text className="text-muted">
              โปรดเลือกเวลาอย่างน้อย 15 นาทีถัดไป
            </Form.Text>
          </div>

          {/* สรุปยอด */}
          <div className="d-flex justify-content-end">
            <div style={{ minWidth: 280 }}>
              <div className="d-flex justify-content-between">
                <span>ยอดสินค้า</span>
                <span>฿ {subtotal.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>ยอดรวมทั้งสิ้น</span>
                <span>฿ {total.toLocaleString()}</span>
              </div>
              <Button
              variant="success"
              className="w-100 rounded-pill mt-3"
              disabled={!canCheckout}
              onClick={goCheckout}
              >
              ชำระเงิน
            </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

function getDefaultPickup() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30); // default +30 นาที
  return toLocalInputValue(d);
}
function minDateTimeLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 15);
  return toLocalInputValue(d);
}
function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
