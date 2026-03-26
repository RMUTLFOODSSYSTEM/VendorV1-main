// src/pages/customer/Home.js
import { useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import products from "../../data/products";
import { useCart } from "../../context/CartContext";

export default function Home() {
  const { add } = useCart();

  // ✅ NEW: ค้นหา + กรองหมวดหมู่ + เรียงลำดับ (ไม่กระทบการทำงานเดิม)
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ทั้งหมด");
  const [sort, setSort] = useState("popular");

  // รวมหมวดหมู่จากสินค้าจริง
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "อื่นๆ"));
    return ["ทั้งหมด", ...Array.from(set)];
  }, []);

  // คัดกรอง + เรียงลำดับ
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const hitText =
        p.name.toLowerCase().includes(q.trim().toLowerCase()) ||
        (p.category || "").toLowerCase().includes(q.trim().toLowerCase());
      const hitCat = cat === "ทั้งหมด" ? true : (p.category || "อื่นๆ") === cat;
      return hitText && hitCat;
    });

    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        // popular: ไม่ทำอะไร (ใช้ลำดับเดิม)
        break;
    }
    return list;
  }, [q, cat, sort]);

  return (
    <Container className="py-4 py-md-5">
      <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 align-items-stretch align-items-md-center mb-3">
        <h4 className="fw-bold mb-0">เมนูสำหรับสั่งซื้อ</h4>

        {/* 🔎 ค้นหา */}
        <Form.Control
          placeholder="ค้นหาเมนูหรือหมวดหมู่…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="ms-md-auto"
          style={{ maxWidth: 320 }}
        />

        {/* 🏷️ หมวดหมู่ */}
        <Form.Select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>

        {/* ↕️ เรียงลำดับ */}
        <Form.Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="popular">แนะนำ</option>
          <option value="price_asc">ราคาต่ำ → สูง</option>
          <option value="price_desc">ราคาสูง → ต่ำ</option>
        </Form.Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 rounded-4 shadow-sm text-center p-4">
          <div className="text-muted">ไม่พบเมนูที่ตรงกับเงื่อนไข</div>
        </Card>
      ) : (
        <Row className="g-3">
          {filtered.map((p) => (
            <Col xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card className="h-100 rounded-4 shadow-sm border-0">
                {/* ถ้ามีรูปใน data ให้แสดง */}
                {p.image && (
                  <div className="ratio ratio-16x9">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded-top-4 object-fit-cover"
                    />
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="fw-semibold mb-1">{p.name}</div>
                  <div className="text-muted small mb-2">{p.category}</div>
                  <div className="mb-3">
                    <Badge bg="success">฿ {p.price.toLocaleString()}</Badge>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="success"
                      className="w-100 rounded-pill"
                      onClick={() => add(p, 1)} // ✅ เหมือนเดิม ไม่เปลี่ยน signature
                    >
                      เพิ่มลงตะกร้า
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
