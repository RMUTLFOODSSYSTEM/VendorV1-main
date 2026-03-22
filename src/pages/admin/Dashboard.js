export default function Dashboard() {
  const summary = {
    totalUsers: 128,
    totalVendors: 18,
    totalOrders: 356,
    pendingPayments: 12,
    pendingComplaints: 5,
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">ภาพรวมระบบ</h2>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
            <h6 className="text-muted">จำนวนผู้ใช้ทั้งหมด</h6>
            <h3 className="fw-bold">{summary.totalUsers}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
            <h6 className="text-muted">จำนวนร้านค้าทั้งหมด</h6>
            <h3 className="fw-bold">{summary.totalVendors}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
            <h6 className="text-muted">จำนวนคำสั่งซื้อทั้งหมด</h6>
            <h3 className="fw-bold">{summary.totalOrders}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
            <h6 className="text-muted">การชำระเงินรอตรวจสอบ</h6>
            <h3 className="fw-bold text-warning">{summary.pendingPayments}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
            <h6 className="text-muted">ข้อร้องเรียนรอดำเนินการ</h6>
            <h3 className="fw-bold text-danger">{summary.pendingComplaints}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}