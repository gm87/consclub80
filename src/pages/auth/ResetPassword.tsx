import SidebarWithContent from "../../layouts/SidebarWithContent"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CognitoUserAttributes from "../../models/CognitoUserAttributes"

interface ResetPasswordProps {
    user: CognitoUserAttributes | null
    completeForgotPassword: (email: string, code: string, newPassword: string) => Promise<any>
}

const ResetPassword = ({ user, completeForgotPassword }: ResetPasswordProps) => {

    const [username, setUsername] = useState<string>('')
    const [userAttributes, setUserAttributes] = useState<any>(null)
    const [error, setError] = useState<string>('')

    const handleUsernameKeyUp = (e: any) => {
        if (e.keyCode === 13)
            handleSubmit()
    }

    const handleSubmit = () => {
        
    }

    return (
        <SidebarWithContent user={user}>
            <Container fluid>
                <Row>
                    <Col><h1 className="display-1 fs-1 mt-3 text-center">Forgot Password</h1></Col>
                </Row>
                <Row className="mt-4">
                    <Col><p className="text-center">Email</p></Col>
                </Row>
                <Row>
                    <Col className="d-sm-none"><input className="form-control" value={username} onChange={e => setUsername(e.target.value)} /></Col>
                    <Col className="d-none d-sm-flex"><input className="form-control w-50 mx-auto" value={username} onChange={e => setUsername(e.target.value)} /></Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <Link to="/auth/login"><Button className="text-decoration-none" variant="link">Sign In</Button></Link>
                    </Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default ResetPassword