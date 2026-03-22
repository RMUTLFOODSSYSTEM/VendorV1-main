import { useState } from "react";

export default function Vendors() {
  const [vendors, setVendors] = useState([
    { id: 1, storeName: "ร้านกะเพราอร่อย", owner: "Aom", email: "vendor1@email.com", status: "approved" },
    { id: 2, storeName: "ร้านชาไทยสด", owner: "Bank", email: "vendor2@email.com", status: "pending" },
    { id: 3, storeName: "ร้านข้าวมันไก่", owner: "May", email: "vendor3@email.com", status: "approved" },
  ]);

  const approveVendor = (id) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id ? { ...vendor, status: "approved" } : vendor
      )
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">จัดการร้านค้า</h2>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อร้าน</th>
                  <th>เจ้าของร้าน</th>
                  <th>อีเมล</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>{vendor.id}</td>
                    <td>{vendor.storeName}</td>
                    <td>{vendor.owner}</td>
                    <td>{vendor.email}</td>
                    <td>
                      <span className={`badge ${vendor.status === "approved" ? "bg-success" : "bg-warning text-dark"}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      {vendor.status !== "approved" ? (
                        <button
                          className="btn btn-sm btn-success rounded-pill"
                          onClick={() => approveVendor(vendor.id)}
                        >
                          อนุมัติร้านค้า
                        </button>
                      ) : (
                        <span className="text-muted">อนุมัติแล้ว</span>
                      )}
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