import { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "สมชาย ใจดี", email: "user1@email.com", role: "customer", status: "active" },
    { id: 2, name: "สายฝน พนา", email: "user2@email.com", role: "customer", status: "active" },
    { id: 3, name: "ทวีศักดิ์ ดีมาก", email: "user3@email.com", role: "customer", status: "blocked" },
  ]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">จัดการผู้ใช้</h2>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อ</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`badge ${user.status === "active" ? "bg-success" : "bg-danger"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-dark rounded-pill"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "active" ? "ระงับบัญชี" : "เปิดใช้งาน"}
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