export default function Reports() {
  const reportData = {
    totalSales: 12500,
    totalOrders: 48,
    successOrders: 42,
    cancelledOrders: 6,
  };

  const dailySales = [
    { date: "10/03/2026", orders: 8, sales: 2100 },
    { date: "11/03/2026", orders: 10, sales: 2600 },
    { date: "12/03/2026", orders: 12, sales: 3100 },
    { date: "13/03/2026", orders: 9, sales: 2200 },
    { date: "14/03/2026", orders: 9, sales: 2500 },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">รายงานและสถิติร้านค้า</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center p-3">
            <h6 className="text-muted">ยอดขายรวม</h6>
            <h3 className="fw-bold text-success">฿{reportData.totalSales}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center p-3">
            <h6 className="text-muted">จำนวนออเดอร์</h6>
            <h3 className="fw-bold">{reportData.totalOrders}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center p-3">
            <h6 className="text-muted">ออเดอร์สำเร็จ</h6>
            <h3 className="fw-bold text-primary">{reportData.successOrders}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center p-3">
            <h6 className="text-muted">ออเดอร์ยกเลิก</h6>
            <h3 className="fw-bold text-danger">{reportData.cancelledOrders}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3">สรุปยอดขายรายวัน</h4>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>จำนวนออเดอร์</th>
                  <th>ยอดขาย (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.orders}</td>
                    <td>{item.sales}</td>
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