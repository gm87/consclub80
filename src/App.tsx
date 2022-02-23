import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cognito from './utils/Cognito'
import CognitoUserAttributes from './models/CognitoUserAttributes'

import Home from './pages/Home'
import MembershipForm from './pages/MembershipForm'
import SponsorshipForm from './pages/SponsorshipForm'
import Bylaws from './pages/Bylaws'
import Rules from './pages/Rules'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import MyAccount from './pages/MyAccount'

import './styles/bootstrap.min.css'

const App = () => {

    const cognito = new Cognito()
    const [cognitoUser, setCognitoUser] = useState<CognitoUserAttributes | null>(null)

    useEffect(() => {
        cognito.GetUser()
        .then(user => {
            let _user: any = {}
            if (!user)
                return setCognitoUser(null)
            for (const attribute of user) {
                _user[attribute.Name] = attribute.Value
            }
            setCognitoUser(_user)
        })
    }, [])

    const signIn = async (email: string, password: string) => {
        const user = await cognito.SignIn(email, password)
        let _user: any = {}
        if (!user)
            return setCognitoUser(null)
        for (const attribute of user) {
            _user[attribute.Name] = attribute.Value
        }
        setCognitoUser(_user)
    }

    const signOut = async () => {
        cognito.SignOut()
        setCognitoUser(null)
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home user={cognitoUser} />} />
                <Route path='/membership' element={<MembershipForm user={cognitoUser} />} />
                <Route path='/sponsorship' element={<SponsorshipForm user={cognitoUser} />} />
                <Route path='/bylaws' element={<Bylaws user={cognitoUser} />} />
                <Route path='/rules' element={<Rules user={cognitoUser} />} />
                <Route path='/auth/login' element={<Login user={cognitoUser} signIn={signIn} changePassword={cognito.ChangePassword} />} />
                <Route path='/auth/forgot-password' element={<ForgotPassword user={cognitoUser} />} />
                <Route path='/myaccount' element={<MyAccount user={cognitoUser} signOut={signOut} />} />
            </Routes>
        </Router>
    )
}

export default App