import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SidebarWithContent from "../layouts/SidebarWithContent"

const Home = () => {
    return (
        <SidebarWithContent>
            <Container fluid className="bg-light h-100">
                <Row>
                    <Col><h1 className="display-1 fs-1 text-center mt-3">Home</h1></Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default Home