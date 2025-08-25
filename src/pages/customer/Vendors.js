import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import vendors from "../../data/vendors";

export default function Vendors() {
  return (
    <Container className="py-4 py-md-5">
      <h4 className="fw-bold mb-3">เลือกร้านอาหาร</h4>
      <Row className="g-3">
        {vendors.map(v => (
          <Col xs={12} sm={6} md={4} key={v.id}>
            <Card className="h-100 rounded-4 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <div className="fw-semibold mb-1">{v.name}</div>
                <div className="text-muted small mb-3">{v.description}</div>
                <div className="mt-auto">
                  <Button as={Link} to={`/shop/vendor/${v.id}`}
                          variant="success" className="w-100 rounded-pill">
                    เข้าดูเมนู
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
