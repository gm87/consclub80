import { Navigate } from "react-router-dom"
import CognitoUserAttributes from "../models/CognitoUserAttributes"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Spinner from "react-bootstrap/Spinner"

interface AuthRequiredRouteProps {
    user: { pending: boolean, data: CognitoUserAttributes | null }
    children: any
}

const AuthRequiredRoute = ({ user, children }: AuthRequiredRouteProps) => {
    if (user.pending) {
        return (
            <Container fluid>
                <Row className="mt-5">
                    <Col className="text-center"><Spinner animation="border" /></Col>
                </Row>
            </Container>
        )
    }

    if (!user.data)
        return <Navigate to='/auth/login' />

    return children
}

export default AuthRequiredRoute