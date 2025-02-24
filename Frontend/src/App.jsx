import './App.css'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import {Routes,Route} from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
function App() {
  return (
    
    <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/Jobs'element={<Jobs/>}/>
      <Route path='/About'element={<About/>}/>
      <Route path='/Contact'element={<Contact/>}/>
      <Route path='/Login'element={<Login/>}/>
      <Route path='/Signup'element={<Signup/>}/>
      </Routes>
  )
}

export default App