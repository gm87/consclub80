import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import Cognito from './utils/Cognito'

import Home from './pages/Home'
import MembershipForm from './pages/MembershipForm'
import SponsorshipForm from './pages/SponsorshipForm'
import Bylaws from './pages/Bylaws'
import Rules from './pages/Rules'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

import './styles/bootstrap.min.css'

const App = () => {

    const cognito = new Cognito()
    const [cognitoUser, setCognitoUser] = useState<CognitoUserAttribute[] | null>(null)

    useEffect(() => {
        cognito.GetUser()
        .then(user => {
            console.log(user)
            setCognitoUser(user)
        })
    }, [])

    const signIn = async (email: string, password: string) => {
        const user = await cognito.SignIn(email, password)
        setCognitoUser(user)
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
            </Routes>
        </Router>
    )
}

export default App