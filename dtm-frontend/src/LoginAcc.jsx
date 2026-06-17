import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function LoginAcc() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
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
    if (remember) {
      localStorage.setItem("userstokens", result.data.token);
      sessionStorage.removeItem("userstokens");
    } else {
      sessionStorage.setItem("userstokens", result.data.token);
      localStorage.removeItem("userstokens");
    }
      nav('/success')
    })
    .catch(err => {
      alert('Invalid credentials')
      console.log(err)
    })
  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-sky-100 to-orange-200 px-4'>
        <form onSubmit={handleLoginBtn} className='w-full max-w-md'>
          <div className='w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 sm:p-10'>
              <div>
                  <div className='text-3xl font-semibold text-center mb-8 text-gray-800'>Login</div>
                  <div className='flex flex-col gap-5'>
                  <input 
                    className='w-full py-3 px-3 bg-white/80 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
                    type="email" 
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                  <input
                    className='w-full py-3 px-3 bg-white/80 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500' 
                    type="password" 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                  <div className='flex items-center gap-2 text-sm text-gray-700'>
                    <input
                    type="checkbox"
                    id="remember"
                    className='h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded'
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="">Remember me</label>
                  </div>
                    <button className='w-full py-3 bg-sky-600 text-white rounded-lg text-lg hover:bg-sky-700 active:bg-sky-800 transition cursor-pointer'>Login</button>
                    <div className='flex justify-center'>
                      <Link 
                        className='text-center text-sm text-sky-700 hover:text-sky-900'
                        to='/create'>No account yet?</Link>
                    </div>
                  </div>
              </div>
          </div>
        </form>
      </div>
    </>
  )
}