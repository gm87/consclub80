import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import MembershipForm from './pages/MembershipForm'
import SponsorshipForm from './pages/SponsorshipForm'
import Bylaws from './pages/Bylaws'
import Rules from './pages/Rules'

import './styles/bootstrap.min.css'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/membership' element={<MembershipForm />} />
                <Route path='/sponsorship' element={<SponsorshipForm />} />
                <Route path='/bylaws' element={<Bylaws />} />
                <Route path='/rules' element={<Rules />} />
            </Routes>
        </Router>
    )
}

export default App