import { useState } from "react";

export default function Complaint() {
  const [form, setForm] = useState({
    orderId: "",
    topic: "",
    detail: "",
  });

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      orderId: "ORD001",
      topic: "ได้รับอาหารไม่ครบ",
      detail: "ขาดน้ำ 1 แก้ว",
      status: "รอดำเนินการ",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.orderId || !form.topic || !form.detail) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const newComplaint = {
      id: complaints.length + 1,
      orderId: form.orderId,
      topic: form.topic,
      detail: form.detail,
      status: "รอดำเนินการ",
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setForm({
      orderId: "",
      topic: "",
      detail: "",
    });

    alert("ส่งเรื่องร้องเรียนเรียบร้อย");
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">ร้องเรียนปัญหา</h2>

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">รหัสคำสั่งซื้อ</label>
              <input
                type="text"
                className="form-control"
                name="orderId"
                value={form.orderId}
                onChange={handleChange}
                placeholder="เช่น ORD001"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">หัวข้อปัญหา</label>
              <select
                className="form-select"
                name="topic"
                value={form.topic}
                onChange={handleChange}
              >
                <option value="">-- เลือกหัวข้อปัญหา --</option>
                <option value="ได้รับอาหารไม่ครบ">ได้รับอาหารไม่ครบ</option>
                <option value="อาหารล่าช้า">อาหารล่าช้า</option>
                <option value="อาหารไม่ตรงเมนู">อาหารไม่ตรงเมนู</option>
                <option value="ปัญหาการชำระเงิน">ปัญหาการชำระเงิน</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">รายละเอียด</label>
              <textarea
                className="form-control"
                rows="4"
                name="detail"
                value={form.detail}
                onChange={handleChange}
                placeholder="กรอกรายละเอียดปัญหา"
              />
            </div>

            <button type="submit" className="btn btn-success rounded-pill px-4">
              ส่งเรื่องร้องเรียน
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3">ประวัติการร้องเรียน</h4>

          {complaints.length === 0 ? (
            <p className="text-muted">ยังไม่มีข้อมูลการร้องเรียน</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>รหัสคำสั่งซื้อ</th>
                    <th>หัวข้อ</th>
                    <th>รายละเอียด</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((item) => (
                    <tr key={item.id}>
                      <td>{item.orderId}</td>
                      <td>{item.topic}</td>
                      <td>{item.detail}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}