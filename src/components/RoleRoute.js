// RoleRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function RoleRoute({ allow, children }) {
  const email = localStorage.getItem("userEmail");
  const role  = localStorage.getItem("role");
  const loc   = useLocation();

  // ยังไม่ได้ล็อกอิน → ส่งไปหน้า login ที่ตรงกับ allow
  if (!email) {
    const loginPath = allow === "vendor" ? "/vendor/login" : "/login";
    return <Navigate to={loginPath} state={{ from: loc }} replace />;
  }

  // ล็อกอินแล้วแต่เป็นคนละบทบาท → ส่งกลับพื้นที่ของบทบาทนั้น
  if (role !== allow) {
    const home = role === "vendor" ? "/vendor/menu" : "/shop";
    return <Navigate to={home} replace />;
  }

  return children;
}
