import SidebarWithContent from "../layouts/SidebarWithContent"
import CognitoUserAttributes from "../models/CognitoUserAttributes"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

interface MyAccountProps {
    user: CognitoUserAttributes | null
    signOut: () => void
}

const MyAccount = ({ user, signOut }: MyAccountProps) => {
    return (
        <SidebarWithContent user={user}>
            <Container fluid>
                <Row>
                    <Col><h1 className="display-1 fs-1 text-center mt-3">My Account</h1></Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center"><Button variant="danger" onClick={signOut}>Sign Out</Button></Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default MyAccount