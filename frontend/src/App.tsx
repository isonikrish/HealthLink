import { Route, Routes } from 'react-router-dom'
import './App.css'
import {Toaster} from 'react-hot-toast'
import Authentication from './pages/Authentication'



function App() {
  return (  
    <div>
      <Routes>
        <Route path='/' element={<Authentication />}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App