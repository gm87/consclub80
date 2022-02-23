import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'

import Home from './pages/Home'
import MembershipForm from './pages/MembershipForm'
import SponsorshipForm from './pages/SponsorshipForm'
import Bylaws from './pages/Bylaws'
import Rules from './pages/Rules'

import './styles/bootstrap.min.css'

import Cognito from './utils/Cognito'


const App = () => {

    const cognito = new Cognito()
    const [cognitoUser, setCognitoUser] = useState<CognitoUserAttribute[] | null>(null)

    useEffect(() => {
        cognito.GetSession()
        cognito.GetUser()
        .then(user => setCognitoUser(user))
    }, [])

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home user={cognitoUser} />} />
                <Route path='/membership' element={<MembershipForm user={cognitoUser} />} />
                <Route path='/sponsorship' element={<SponsorshipForm user={cognitoUser} />} />
                <Route path='/bylaws' element={<Bylaws user={cognitoUser} />} />
                <Route path='/rules' element={<Rules user={cognitoUser} />} />
            </Routes>
        </Router>
    )
}

export default App