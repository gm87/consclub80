import { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Sidebar from "../components/Sidebar";

interface props {
    children: ReactNode
}

const SidebarWithContent = ({ children }: props) => {
    return (
        <Container fluid>
            <Row>
                <Sidebar />
                <Col className="px-0" style={{ marginLeft: "280px", minHeight: "100vh" }}>
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default SidebarWithContent