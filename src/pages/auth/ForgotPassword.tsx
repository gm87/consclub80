import SidebarWithContent from "../../layouts/SidebarWithContent"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { useState } from "react"
import { Link } from "react-router-dom"
import CognitoUserAttributes from "../../models/CognitoUserAttributes"

interface LoginProps {
    user: CognitoUserAttributes | null
    sendForgotPasswordEmail: (email: string) => Promise<any>
    completeForgotPassword: (email: string, code: string, password: string) => Promise<any>
}

const ForgotPassword = ({ user, sendForgotPasswordEmail, completeForgotPassword }: LoginProps) => {

    const [username, setUsername] = useState<string>('')
    const [codeDeliveryDetails, setCodeDeliveryDetails] = useState<{AttributeName: "email", DeliveryMedium: "EMAIL", Destination: string } | null>(null)
    const [code, setCode] = useState<string>('')
    const [password, setPassword] = useState<{ new_password: string, new_password_confirm: string }>({ new_password: '', new_password_confirm: '' })
    const [error, setError] = useState<string>('')

    const handleUsernameKeyUp = (e: any) => {
        if (e.keyCode === 13)
            handleSubmit()
    }

    const handleNewPasswordKeyUp = (e: any) => {
        if (e.keyCode === 13)
            handleNewPassword()
    }

    const handleSubmit = () => {
        sendForgotPasswordEmail(username)
        .then(response => {
            setCodeDeliveryDetails(response.CodeDeliveryDetails)
        })
        .catch(err => console.error(err))
    }

    const handleNewPassword = () => {
        completeForgotPassword(username, code, password.new_password)
        .catch(err => {
            if (err.message === "Password does not conform to policy: Password must have uppercase characters" ||
                err.message === "Password does not conform to policy: Password must have symbol characters" ||
                err.message === "Password does not conform to policy: Password not long enough" ||
                err.message === "Password does not conform to policy: Password must have lowercase characterss")
                setError(err.message)
            else
                console.error(err)
        })
    }

    if (codeDeliveryDetails) {
        return (
            <SidebarWithContent user={user}>
                <Container fluid>
                    <Row>
                        <Col><h1 className="display-1 fs-1 mt-3 text-center">Forgot Password</h1></Col>
                    </Row>
                    <Row className="mt-4">
                        <Col><p className="text-center">We've sent an email with a reset code to {codeDeliveryDetails.Destination}. Input that code below.</p></Col>
                    </Row>
                    <Row className="mt-4">
                        <Col><p className="text-center">Recovery Code</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input className="form-control" value={code} onChange={e => setCode(e.target.value)} /></Col>
                        <Col className="d-none d-sm-flex"><input className="form-control w-50 mx-auto" value={code} onChange={e => setCode(e.target.value)} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className="text-center">New Password</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input type="password" className="form-control" value={password.new_password} onChange={e => setPassword({ ...password, new_password: e.target.value })} /></Col>
                        <Col className="d-none d-sm-flex"><input type="password" className="form-control w-50 mx-auto" value={password.new_password} onChange={e => setPassword({ ...password, new_password: e.target.value })} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className="text-center">Confirm New Password</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input type="password" className="form-control" value={password.new_password_confirm} onChange={e => setPassword({ ...password, new_password_confirm: e.target.value })} /></Col>
                        <Col className="d-none d-sm-flex"><input type="password" onKeyUp={handleNewPasswordKeyUp} className="form-control w-50 mx-auto" value={password.new_password_confirm} onChange={e => setPassword({ ...password, new_password_confirm: e.target.value })} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className={error ? `d-block text-danger text-center mb-0` : `d-hidden mb-0`}>{error || '.'}</p></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-center">
                            <Button onClick={handleNewPassword}>Submit</Button>
                        </Col>
                    </Row>
                </Container>
            </SidebarWithContent>
        )
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
                    <Col className="d-none d-sm-flex"><input className="form-control w-50 mx-auto" onKeyUp={handleUsernameKeyUp} value={username} onChange={e => setUsername(e.target.value)} /></Col>
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

export default ForgotPassword