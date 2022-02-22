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
                <Col xs={2} className="px-0">
                    <Sidebar />
                </Col>
                <Col xs={10} className="px-0">
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default SidebarWithContent