import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Bylaws from './pages/Bylaws'
import Rules from './pages/Rules'

import './styles/bootstrap.min.css'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/bylaws' element={<Bylaws />} />
                <Route path='/rules' element={<Rules />} />
            </Routes>
        </Router>
    )
}

export default App