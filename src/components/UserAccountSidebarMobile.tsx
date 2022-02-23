import { Link } from "react-router-dom"
import CognitoUserAttributes from "../models/CognitoUserAttributes"

interface UserAccountSidebarMobileProps {
    user: CognitoUserAttributes | null
    collapsed: boolean
}

const SignInIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
            <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
        </svg>
    )
}

const MyAccountIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
    )
}

const UserAccountSidebarMobile = ({ user, collapsed }: UserAccountSidebarMobileProps) => {
    const currentPath = window.location.pathname

    if (!user) {
        if (collapsed) {
            return (
                <ul className="nav nav-pills flex-column">
                    <Link to={`/auth/login`} className={`nav-link ${`/auth/login` === currentPath ? 'active' : ''}`}><span className="my-auto me-2 text-white"><SignInIcon /></span></Link>
                </ul>
            )
        }
        return (
            <ul className="nav nav-pills flex-column">
                <Link to={`/auth/login`} className={`nav-link ${`/auth/login` === currentPath ? 'active' : ''}`}><span className="my-auto me-2 text-white"><SignInIcon /></span> Sign In</Link>
            </ul>
        )
    }
    if (collapsed) {
        return (
            <ul className="nav nav-pills flex-column">
                <Link to={`/myaccount`} className={`nav-link ${`/myaccount` === currentPath ? 'active' : ''}`}><span className="my-auto me-2 text-white"><MyAccountIcon /></span></Link>
            </ul>
        )
    }
    return (
        <ul className="nav nav-pills flex-column mb-2">
            <Link to={`/myaccount`} className={`nav-link ${`/myaccount` === currentPath ? 'active' : ''}`}><span className="my-auto me-2 text-white"><MyAccountIcon /></span> {user.family_name}, {user.given_name}</Link>
        </ul>
    )
}

export default UserAccountSidebarMobile