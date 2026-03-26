import { useMemo, useState } from "react";
import {Container, Row, Col, Card, Button, Table,Modal, Form, InputGroup} from "react-bootstrap";


export default function MenuManage() {
  // ====== ตัวอย่างข้อมูลเริ่มต้น (mock) ======
  const [items, setItems] = useState([
    { id: 1, name: "ข้าวกะเพรา", price: 45, category: "อาหารจานเดียว", available: true },
    { id: 2, name: "ชาเขียวเย็น", price: 25, category: "เครื่องดื่ม", available: true },
    { id: 3, name: "ข้าวผัดกุ้ง", price: 55, category: "อาหารจานเดียว", available: false },
  ]);

  // ====== ค้นหา ======
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(keyword) ||
        String(i.price).includes(keyword) ||
        (i.category || "").toLowerCase().includes(keyword)
    );
  }, [q, items]);

  // ====== Modal (เพิ่ม/แก้ไข) ======
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // ถ้า null = เพิ่ม, ถ้า object = แก้ไข
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    available: true,
    imageFile: null,
    imagePreview: null,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", price: "", category: "", available: true, imageFile: null, imagePreview: null });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category || "",
      available: !!item.available,
      imageFile: null,
      imagePreview: null,
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
    } else if (type === "file") {
      const file = files?.[0] || null;
      setForm((s) => ({ ...s, imageFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setForm((s) => ({ ...s, imagePreview: reader.result }));
        reader.readAsDataURL(file);
      } else {
        setForm((s) => ({ ...s, imagePreview: null }));
      }
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const saveItem = (e) => {
    e.preventDefault();

    // แปลงราคาเป็น number
    const priceNum = Number(form.price);
    if (!form.name.trim() || Number.isNaN(priceNum)) return;

    if (editing) {
      // แก้ไข
      setItems((prev) =>
        prev.map((it) =>
          it.id === editing.id
            ? {
                ...it,
                name: form.name.trim(),
                price: priceNum,
                category: form.category.trim(),
                available: form.available,
                // imageFile: form.imageFile, // ต่อ API อัปโหลดจริงภายหลัง
              }
            : it
        )
      );
    } else {
      // เพิ่ม
      const newItem = {
        id: Math.max(0, ...items.map((i) => i.id)) + 1,
        name: form.name.trim(),
        price: priceNum,
        category: form.category.trim(),
        available: form.available,
        // imageFile: form.imageFile,
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setShowModal(false);
  };

  const removeItem = (id) => {
    if (!window.confirm("ลบเมนูนี้ใช่หรือไม่?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-3 p-md-4">

              {/* แถวบน: ค้นหา + ปุ่มเพิ่ม */}
              <Row className="g-2 align-items-center mb-3">
                <Col xs={12} md>
                  <InputGroup>
                    <InputGroup.Text>ค้นหา</InputGroup.Text>
                    <Form.Control
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="ชื่อเมนู / ราคา / หมวดหมู่"
                    />
                  </InputGroup>
                </Col>
                <Col xs="auto">
                  <Button variant="success" className="rounded-pill px-3" onClick={openAdd}>
                    + เพิ่มเมนู
                  </Button>
                </Col>
              </Row>

              {/* ตารางเมนู */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th style={{width: 56}}>#</th>
                      <th>ชื่อเมนู</th>
                      <th style={{width: 120}}>ราคา (฿)</th>
                      <th>หมวดหมู่</th>
                      <th style={{width: 120}}>สถานะ</th>
                      <th style={{width: 180}} className="text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          ไม่พบรายการ
                        </td>
                      </tr>
                    ) : (
                      filtered.map((it, idx) => (
                        <tr key={it.id}>
                          <td>{idx + 1}</td>
                          <td>{it.name}</td>
                          <td>{it.price}</td>
                          <td>{it.category || "-"}</td>
                          <td>
                            {it.available ? (
                              <span className="badge bg-success">ขายอยู่</span>
                            ) : (
                              <span className="badge bg-secondary">ปิดขาย</span>
                            )}
                          </td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => openEdit(it)}
                            >
                              แก้ไข
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => removeItem(it.id)}
                            >
                              ลบ
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal เพิ่ม/แก้ไข */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "แก้ไขเมนู" : "เพิ่มเมนู"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveItem}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-3">
              <Form.Label>ชื่อเมนู</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="เช่น ข้าวกะเพรา"
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>ราคา (บาท)</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={onChange}
                    placeholder="เช่น 45"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>หมวดหมู่</Form.Label>
                  <Form.Control
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    placeholder="เช่น อาหารจานเดียว"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              className="mt-3"
              type="switch"
              id="available"
              label="เปิดขาย"
              name="available"
              checked={form.available}
              onChange={onChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>ยกเลิก</Button>
            <Button variant="success" type="submit">{editing ? "บันทึก" : "เพิ่มเมนู"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
