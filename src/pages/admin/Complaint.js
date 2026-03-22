import { useState } from "react";

export default function Complaints() {
  const [complaints, setComplaints] = useState([
    {
      id: "CP001",
      from: "customer",
      orderId: "ORD001",
      topic: "ได้รับอาหารไม่ครบ",
      detail: "ขาดน้ำ 1 แก้ว",
      status: "pending",
    },
    {
      id: "CP002",
      from: "vendor",
      orderId: "ORD010",
      topic: "ปัญหาการชำระเงิน",
      detail: "ระบบไม่อัปเดตสถานะ",
      status: "pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">จัดการข้อร้องเรียน</h2>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>รหัสเรื่อง</th>
                  <th>ผู้ส่ง</th>
                  <th>รหัสออเดอร์</th>
                  <th>หัวข้อ</th>
                  <th>รายละเอียด</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.from}</td>
                    <td>{item.orderId}</td>
                    <td>{item.topic}</td>
                    <td>{item.detail}</td>
                    <td>
                      <span className={`badge ${item.status === "resolved" ? "bg-success" : "bg-warning text-dark"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => updateStatus(item.id, "resolved")}
                      >
                        ปิดเรื่อง
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}