import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import SidebarWithContent from "../layouts/SidebarWithContent"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

interface MembershipFormProps {
    user: CognitoUserAttribute[] | null
}

const MembershipForm = ({ user }: MembershipFormProps) => {
    return (
        <SidebarWithContent user={user}>
            <Container fluid className="bg-light h-100">
                <Row>
                    <Col><h1 className="display-1 fs-1 text-center mt-3">Membership Form</h1></Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default MembershipForm