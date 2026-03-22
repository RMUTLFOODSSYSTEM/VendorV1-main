import { useState } from "react";

export default function Payments() {
  const [payments, setPayments] = useState([
    {
      id: "PAY001",
      orderId: "ORD001",
      customerName: "สมชาย",
      amount: 120,
      slipImage: "https://via.placeholder.com/120x180?text=Slip+1",
      status: "pending",
    },
    {
      id: "PAY002",
      orderId: "ORD002",
      customerName: "สายฝน",
      amount: 85,
      slipImage: "https://via.placeholder.com/120x180?text=Slip+2",
      status: "pending",
    },
  ]);

  const updatePaymentStatus = (id, newStatus) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment
      )
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">ตรวจสอบและอนุมัติการชำระเงิน</h2>

      <div className="row g-3">
        {payments.map((payment) => (
          <div className="col-md-6" key={payment.id}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">{payment.id}</h5>
                <p className="mb-1"><strong>รหัสคำสั่งซื้อ:</strong> {payment.orderId}</p>
                <p className="mb-1"><strong>ลูกค้า:</strong> {payment.customerName}</p>
                <p className="mb-3"><strong>ยอดชำระ:</strong> ฿{payment.amount}</p>

                <img
                  src={payment.slipImage}
                  alt="slip"
                  className="img-fluid rounded border mb-3"
                />

                <p>
                  <strong>สถานะ:</strong>{" "}
                  <span className={`badge ${payment.status === "approved" ? "bg-success" : payment.status === "rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                    {payment.status}
                  </span>
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm rounded-pill"
                    onClick={() => updatePaymentStatus(payment.id, "approved")}
                  >
                    อนุมัติ
                  </button>

                  <button
                    className="btn btn-danger btn-sm rounded-pill"
                    onClick={() => updatePaymentStatus(payment.id, "rejected")}
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}