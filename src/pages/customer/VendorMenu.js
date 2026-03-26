import { useParams } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import vendors from "../../data/vendors";
import vendorMenus from "../../data/vendorMenus";
import { useCart } from "../../context/CartContext";

export default function VendorMenu() {
  const { vid } = useParams();                     // id ร้านจาก URL
  const { add } = useCart();                       // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  const vendor = vendors.find(v => v.id === vid);
  const items = vendorMenus[vid] || [];

  // state สำหรับเลือก addon และจำนวนของแต่ละเมนู
  const [state, setState] = useState(() =>
    Object.fromEntries(items.map(i => [i.id, { addonKey: i.addons?.[0]?.key || "normal", qty: 1 }]))
  );

  const update = (id, patch) =>
    setState(s => ({ ...s, [id]: { ...s[id], ...patch }}));

  const addToCart = (it) => {
    const sel = state[it.id];
    const addon = (it.addons || []).find(a => a.key === sel.addonKey) || { extra: 0, label: "ธรรมดา" };
    const finalPrice = it.price + addon.extra;

    // โยนรายละเอียด addon ไปกับสินค้า เพื่อใช้แสดงในตะกร้า/ใบสั่งซื้อ
    add({
      id: `${it.id}_${addon.key}`,
      name: `${it.name} - ${addon.label}`,
      price: finalPrice,
      vendorId: vid,
      basePrice: it.price,
      addon,                 // { key, label, extra }
    }, sel.qty);
  };

  if (!vendor) {
    return (
      <Container className="py-4">
        <div className="text-muted">ไม่พบร้านนี้</div>
      </Container>
    );
  }

  return (
    <Container className="py-4 py-md-5">
      <h4 className="fw-bold mb-1">{vendor.name}</h4>
      <div className="text-muted mb-3">{vendor.description}</div>

      <Row className="g-3">
        {items.map(it => {
          const sel = state[it.id];
          const addon = (it.addons || []).find(a => a.key === sel.addonKey) || { extra: 0 };
          const finalPrice = it.price + addon.extra;

          return (
            <Col xs={12} sm={6} md={4} lg={3} key={it.id}>
              <Card className="h-100 rounded-4 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="fw-semibold mb-1">{it.name}</div>
                  <div className="text-muted small mb-2">เลือกระดับความอิ่ม</div>

                  {/* เลือก Add-on */}
                  <Form.Select
                    className="mb-2"
                    value={sel.addonKey}
                    onChange={(e)=>update(it.id, { addonKey: e.target.value })}
                  >
                    {(it.addons || []).map(a =>
                      <option key={a.key} value={a.key}>{a.label}</option>
                    )}
                  </Form.Select>

                  {/* จำนวน */}
                  <Form.Control
                    type="number"
                    min={1}
                    className="mb-3"
                    value={sel.qty}
                    onChange={(e)=>update(it.id, { qty: Math.max(1, Number(e.target.value)||1) })}
                  />

                  {/* ราคาแสดงผลหลังเลือก */}
                  <div className="mb-3">
                    <Badge bg="success">฿ {finalPrice.toLocaleString()}</Badge>
                    <span className="text-muted small ms-2">(พื้นฐาน {it.price})</span>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="success"
                      className="w-100 rounded-pill"
                      onClick={()=>addToCart(it)}
                    >
                      เพิ่มลงตะกร้า
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
