import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuManage from "./pages/MenuManage";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ เพิ่ม

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("userEmail"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

  // ✅ บันทึกอีเมลไว้ใน localStorage ด้วย เพื่อให้รีเฟรช/เข้าใหม่ยังจำได้
  const handleLogin = (email) => {
    if (email) localStorage.setItem("userEmail", email);
    setAuthed(true);
    setUserEmail(email || null);
  };

  const handleLogout = () => {
    setAuthed(false);
    setUserEmail(null);
    localStorage.removeItem("userEmail");
    // (ออปชัน) ลบโปรไฟล์ที่แคชไว้
    // localStorage.removeItem(`profile:${(userEmail || "").toLowerCase()}`);
  };

  // หน้า Landing ใช้เป็น "หน้าหลัก" เสมอ
  const Landing = () => (
    <div className="container py-5">
      <section className="bg-success bg-opacity-10 p-4 rounded-4 text-center mb-4">
        <h1 className="fw-bold">
          ยินดีต้อนรับสู่ <span className="text-success">RMUTL Shop</span>
        </h1>
        <p className="text-muted">
          ระบบสั่งอาหารและสินค้าสำหรับนักศึกษาและบุคลากร RMUTL
          <br />สะดวก รวดเร็ว ไม่ต้องรอคิวหน้าร้าน
        </p>
      </section>

      <section className="bg-light p-4 rounded-4 text-center">
        <h3 className="text-success fw-bold mb-3">เกี่ยวกับเรา</h3>
        <p>
          เราเป็นระบบสั่งซื้อสินค้าออนไลน์สำหรับนักศึกษาและบุคลากร RMUTL
          ที่ช่วยให้การสั่งซื้อสะดวกขึ้น ลดเวลารอคิว และสนับสนุนร้านค้าภายในมหาวิทยาลัย
        </p>
        <p>
          สร้างสีสันค้าพันธมิตร RMUTL ระบบของเราช่วยให้คุณสามารถเลือกซื้อสินค้า
          จากนักศึกษาและบุคลากรได้แบบเรียลไทม์ จัดการออเดอร์ได้สะดวก รวดเร็ว
          และช่วยโปรโมทร้านของคุณให้เข้าถึงลูกค้าในมหาวิทยาลัยได้มากขึ้น
        </p>
      </section>
    </div>
  );

  return (
    <>
      <AppNavbar authed={authed} onLogout={handleLogout} />

      <Routes>
        {/* หน้าหลัก */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ เพิ่ม */}

        {/* หน้าฟีเจอร์ */}
        <Route path="/menu" element={<MenuManage />} />
        <Route path="/profile" element={<Profile authed={authed} userEmail={userEmail} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      {/* footer ติดล่าง */}
      <footer className="text-center text-muted small py-2 bg-white border-top fixed-bottom">
        © {new Date().getFullYear()} RMUTL Shop. All rights reserved.
      </footer>
    </>
  );
}
