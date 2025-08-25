import { useMemo, useState } from "react";
import { Container, Card, Table, Badge } from "react-bootstrap";

const ORDERS_KEY = (email) => `customer:orders:${(email||"guest").toLowerCase()}`;

const StatusBadge = ({ s }) => {
  const map = { pending:"secondary", paid:"primary", preparing:"warning", completed:"success", cancelled:"danger" };
  return <Badge bg={map[s] || "secondary"} className="text-uppercase">{s}</Badge>;
};

export default function MyOrders() {
  const email = localStorage.getItem("userEmail") || "guest@example.com";
  const [orders] = useState(() => {
    const raw = localStorage.getItem(ORDERS_KEY(email));
    return raw ? JSON.parse(raw) : [];
  });

  const data = useMemo(() =>
    [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  , [orders]);

  return (
    <Container className="py-4 py-md-5">
      <h4 className="fw-bold mb-3">ออเดอร์ของฉัน</h4>
      <Card className="rounded-4 shadow-sm border-0">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th style={{width:140}}>เลขออเดอร์</th>
                  <th>รายการ</th>
                  <th style={{width:120}} className="text-end">รวม (฿)</th>
                  <th style={{width:140}} className="text-center">สถานะ</th>
                  <th style={{width:200}}>เวลา</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted py-4">ยังไม่มีออเดอร์</td></tr>
                ) : data.map(o => (
                  <tr key={o.id}>
                    <td className="fw-semibold">{o.id}</td>
                    <td>
                      {o.items.map((it,i)=>(
                        <div key={i} className="text-muted small">
                          {it.name} × {it.qty} — ฿ {(it.price*it.qty).toLocaleString()}
                        </div>
                      ))}
                    </td>
                    <td className="text-end">{o.total.toLocaleString()}</td>
                    <td className="text-center"><StatusBadge s={o.status}/></td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="text-muted small">* ณ ตอนนี้เป็น mock — เมื่อเชื่อม Backend สถานะจะอัปเดตอัตโนมัติ</div>
        </Card.Body>
      </Card>
    </Container>
  );
}
