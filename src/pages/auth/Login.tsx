import SidebarWithContent from "../../layouts/SidebarWithContent"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CognitoUserAttributes from "../../models/CognitoUserAttributes"

interface LoginProps {
    user: CognitoUserAttributes | null
    signIn: (username: string, password: string) => Promise<any>
    changePassword: (newPassword: string, userAttributes: any) => Promise<'Success'>
}

const Login = ({ user, signIn, changePassword }: LoginProps) => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [newPasswordRequired, setNewPasswordRequired] = useState<boolean>(false)
    const [newPassword, setNewPassword] = useState<{ new_password: string, new_password_confirm: string }>({ new_password: '', new_password_confirm: '' })
    const [userAttributes, setUserAttributes] = useState<any>(null)
    const [error, setError] = useState<string>('')

    const handleSignIn = () => {
        setError('')
        signIn(username, password)
        .catch(err => {
            if (err.message === "Incorrect username or password.") {
                setError(`Incorrect username or password.`)
            } else if (err.message === "New password required." || err.message === "Password reset required for the user") {
                setNewPasswordRequired(true)
                setUserAttributes(err.userAttributes)
            } else {
                console.error(err)
                setError(`Something went wrong. Try again later.`)
            }
        })
    }

    const handleChangePassword = () => {
        let _userAttributes = { ...userAttributes, family_name: "Matthews", given_name: "Graham" }
        delete _userAttributes.email_verified
        delete _userAttributes.phone_number_verified
        if (newPassword.new_password !== newPassword.new_password_confirm)
            return setError('Passwords do not match')
        changePassword(newPassword.new_password, _userAttributes)
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

    const handlePasswordKeyUp = (e: any) => {
        if (e.keyCode === 13)
            handleSignIn()
    }

    const handleNewPasswordKeyUp = (e: any) => {
        if (e.keyCode === 13)
            handleChangePassword()
    }

    if (newPasswordRequired) {
        return (
            <SidebarWithContent user={user}>
                <Container fluid>
                    <Row>
                        <Col><h1 className="display-1 fs-1 mt-3 text-center">New Password</h1></Col>
                    </Row>
                    <Row className="mt-4">
                        <Col><p className="text-center">Old Password</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} /></Col>
                        <Col className="d-none d-sm-flex"><input type="password" className="form-control w-50 mx-auto" value={password} onChange={e => setPassword(e.target.value)} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className="text-center">New Password</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input type="password" className="form-control" value={newPassword.new_password} onChange={e => setNewPassword({ ...newPassword, new_password: e.target.value })} /></Col>
                        <Col className="d-none d-sm-flex"><input type="password" className="form-control w-50 mx-auto" value={newPassword.new_password} onChange={e => setNewPassword({ ...newPassword, new_password: e.target.value })} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className="text-center">Confirm New Password</p></Col>
                    </Row>
                    <Row>
                        <Col className="d-sm-none"><input type="password" className="form-control" value={newPassword.new_password_confirm} onChange={e => setNewPassword({ ...newPassword, new_password_confirm: e.target.value })} /></Col>
                        <Col className="d-none d-sm-flex"><input type="password" onKeyUp={handleNewPasswordKeyUp} className="form-control w-50 mx-auto" value={newPassword.new_password_confirm} onChange={e => setNewPassword({ ...newPassword, new_password_confirm: e.target.value })} /></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col><p className={error ? `d-block text-danger text-center mb-0` : `d-hidden mb-0`}>{error || '.'}</p></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-center">
                            <Button onClick={handleChangePassword}>Submit</Button>
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
                    <Col><h1 className="display-1 fs-1 mt-3 text-center">Sign In</h1></Col>
                </Row>
                <Row className="mt-4">
                    <Col><p className="text-center">Username</p></Col>
                </Row>
                <Row>
                    <Col className="d-sm-none"><input className="form-control" value={username} onChange={e => setUsername(e.target.value)} /></Col>
                    <Col className="d-none d-sm-flex"><input className="form-control w-50 mx-auto" value={username} onChange={e => setUsername(e.target.value)} /></Col>
                </Row>
                <Row className="mt-3">
                    <Col><p className="text-center">Password</p></Col>
                </Row>
                <Row>
                    <Col className="d-sm-none"><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} /></Col>
                    <Col className="d-none d-sm-flex"><input type="password" onKeyUp={handlePasswordKeyUp} className="form-control w-50 mx-auto" value={password} onChange={e => setPassword(e.target.value)} /></Col>
                </Row>
                <Row className="mt-3">
                    <Col><p className={error ? `d-block text-danger text-center mb-0` : `d-hidden mb-0`}>{error || '.'}</p></Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <Button onClick={handleSignIn}>Sign In</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <Link to="/auth/forgot-password"><Button className="text-decoration-none" variant="link">Forgot Password</Button></Link>
                    </Col>
                </Row>
            </Container>
        </SidebarWithContent>
    )
}

export default Login