import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function LoginAcc() {
  const [user, setUser] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handleLoginBtn = (e) => {
    e.preventDefault()
    if(!email || !password){
      alert('Please fill out fields')
      return
    }
    axios.post('http://localhost:3004/createLogin', {
      email: email, password: password
    })
    .then(result => {
      setUser(result.data.user)
      localStorage.setItem('userstokens', result.data.token)
      nav('/success')
    })
    .catch(err => {
      alert('Invalid credentials')
      console.log(err)
    })
  }

  return (
    <>
      <form onSubmit={handleLoginBtn}>
          <div className="flex justify-center items-center h-200">
              <div className="ring shadow-xl ring-gray-900/5 flex-col w-110 h-120 rounded">
                  <div className="flex justify-center items-center align-middle text-4xl font-semibold text-black h-30">Login</div>
                  <div className="flex flex-col justify-center items-center gap-5 not-odd:h-70">
                  <input 
                    className="focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-700 py-3 px-2 w-70 border border-gray-400 rounded"
                    type="text" 
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                  <input
                    className="focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-700 py-3 px-2 w-70 border border-gray-400 rounded" 
                    type="password" 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                  <div className='flex w-70 items-center gap-1'>
                    <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label htmlFor="">Remember me</label>
                  </div>
                    <button className="active:bg-sky-500 bg-sky-500 hover:bg-sky-700 text-white py-3 px-20 rounded text-lg cursor-pointer">Login</button>
                    <div>
                      <Link 
                        className='text-sky-500 hover:text-sky-700 active:text-sky-500'
                        to='/create'>No account yet?</Link>
                    </div>
                  </div>
              </div>
          </div>
      </form>
    </>
  )
}

