import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@rmutl.ac.th");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    onLogin(email);
    navigate("/admin/dashboard");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "520px" }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h2 className="fw-bold text-center text-success mb-4">เข้าสู่ระบบแอดมิน</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">อีเมล</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rmutl.ac.th"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}