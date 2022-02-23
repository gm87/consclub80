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
import AuthRequiredRoute from './components/AuthRequiredRoute'
import NoAuthRoute from './components/NoAuthRoute'

const App = () => {

    const cognito = new Cognito()
    const [cognitoUser, setCognitoUser] = useState<{ pending: boolean, data: CognitoUserAttributes | null }>({ pending: true, data: null })

    useEffect(() => {
        cognito.GetUser()
        .then(user => {
            let _user: any = {}
            if (!user)
                return setCognitoUser({ pending: false, data: null })
            for (const attribute of user) {
                _user[attribute.Name] = attribute.Value
            }
            setCognitoUser({ pending: false, data: _user })
        })
    }, [])

    const signIn = async (email: string, password: string) => {
        const user = await cognito.SignIn(email, password)
        let _user: any = {}
        if (!user)
            return setCognitoUser({ pending: false, data: null })
        for (const attribute of user) {
            _user[attribute.Name] = attribute.Value
        }
        setCognitoUser({ pending: false, data: _user })
    }

    const signOut = async () => {
        cognito.SignOut()
        setCognitoUser({ pending: false, data: null })
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home user={cognitoUser.data} />} />
                <Route path='/membership' element={<MembershipForm user={cognitoUser.data} />} />
                <Route path='/sponsorship' element={<SponsorshipForm user={cognitoUser.data} />} />
                <Route path='/bylaws' element={<Bylaws user={cognitoUser.data} />} />
                <Route path='/rules' element={<Rules user={cognitoUser.data} />} />
                <Route path='/auth/login' element={<NoAuthRoute user={cognitoUser}><Login user={cognitoUser.data} signIn={signIn} changePassword={cognito.ChangePassword} /></NoAuthRoute>} />
                <Route path='/auth/forgot-password' element={<NoAuthRoute user={cognitoUser}><ForgotPassword user={cognitoUser.data} /></NoAuthRoute>} />
                <Route path='/myaccount' element={<AuthRequiredRoute user={cognitoUser}><MyAccount user={cognitoUser.data} signOut={signOut} /></AuthRequiredRoute>} />
            </Routes>
        </Router>
    )
}

export default App