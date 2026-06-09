import { BrowserRouter, Routes, Route} from 'react-router-dom'
import CreateAcc from './CreateAcc'
import LoginAcc from './LoginAcc'
import Dashboard from './Dashboard'

export default function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginAcc />}/>
        <Route path='/create' element={<CreateAcc />}/>
        <Route path='/success' element={<Dashboard />}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

