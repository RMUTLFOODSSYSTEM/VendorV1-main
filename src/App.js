import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";

/* ===== ลูกค้า (Customer) ===== */
import Home from "./pages/customer/Home";
import Cart from "./pages/customer/Cart";
import MyOrders from "./pages/customer/MyOrders";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import Checkout from "./pages/customer/Checkout";
import CustomerProfile from "./pages/customer/Profile";
import CustomerNotifications from "./pages/customer/Notifications";
import Vendors from "./pages/customer/Vendors";
import VendorMenu from "./pages/customer/VendorMenu";

/* ===== ร้านค้า (Vendor) ===== */
import VendorLogin from "./pages/vendor/Login";
import VendorRegister from "./pages/vendor/Register";
import MenuManage from "./pages/vendor/MenuManage";
import Profile from "./pages/vendor/Profile";
import Orders from "./pages/vendor/Orders";
import Notifications from "./pages/vendor/Notifications";
import ForgotPassword from "./pages/vendor/ForgotPassword";


/* boot state จาก localStorage */
const getBootState = () => {
  const email = localStorage.getItem("userEmail") || null;
  const role  = localStorage.getItem("role") || null; // "customer" | "vendor" | null
  return { authed: !!email, userEmail: email, role };
};

export default function App() {
  const boot = getBootState();
  const [authed, setAuthed] = useState(boot.authed);
  const [userEmail, setUserEmail] = useState(boot.userEmail);
  const [role, setRole] = useState(boot.role);

  const handleLogin = (email, userRole = "customer") => {
    if (email) localStorage.setItem("userEmail", email);
    localStorage.setItem("role", userRole);
    setAuthed(true);
    setUserEmail(email || null);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    setAuthed(false);
    setUserEmail(null);
    setRole(null);
  };

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
      {/* ✅ ส่ง role ลง Navbar เพื่อให้สลับปุ่ม Login/Register ↔ Logout ได้ถูกต้อง */}
      <AppNavbar authed={authed} role={role} onLogout={handleLogout} />

      <Routes>
        {/* ===== ลูกค้า (ค่าเริ่มต้น) ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Home />} />
        <Route path="/shop/cart" element={<Cart />} />
        <Route path="/shop/checkout" element={<Checkout />} /> 
        <Route path="/shop/orders" element={<MyOrders />} />
        {/* หน้าเมนูหลักลูกค้า */}
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/notifications" element={<CustomerNotifications />} />
        <Route path="/shop/vendors" element={<Vendors />} />
        <Route path="/shop/vendor/:vid" element={<VendorMenu />} />

        {/* หน้า Auth ลูกค้า */}
        <Route path="/login" element={<CustomerLogin onLogin={(email)=>handleLogin(email,"customer")} />} />
        <Route path="/register" element={<CustomerRegister onLogin={(email)=>handleLogin(email,"customer")} />} />
        


        {/* ===== ร้านค้า (อยู่ใต้ /vendor) ===== */}
        <Route path="/vendor/login" element={<VendorLogin onLogin={(email)=>handleLogin(email,"vendor")} />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/forgot-password" element={<ForgotPassword />} />
        <Route path="/vendor/menu" element={<MenuManage />} />
        <Route path="/vendor/profile"element={<Profile authed={authed} userEmail={userEmail} />} />
        <Route path="/vendor/orders" element={<Orders />} />
        <Route path="/vendor/notifications" element={<Notifications />} />
      </Routes>

      <footer className="text-center text-muted small py-2 bg-white border-top fixed-bottom">
        © {new Date().getFullYear()} RMUTL Shop. All rights reserved.
      </footer>
    </>
  );
}
