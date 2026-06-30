import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function LoginAcc() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const nav = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  

  const handleLoginBtn = (e) => {
    e.preventDefault()
    if(!email || !password){
      alert('Please fill out fields')
      return
    }

    setError('');
    setLoading(true)
    axios.post(`${import.meta.env.VITE_API_URL}/createLogin`, {
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
    .catch(() => {
      setError('Invalid credentials')
    })
    .finally(() => {
      setLoading(false);
    })
  }

  return (
    <>
      {
        loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
      }
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-sky-100 to-orange-200'>
        <form
            onSubmit={handleLoginBtn}
            className={`w-full max-w-md sm:p-4 transition-opacity duration-300 ${
                loading ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
          <div className='w-full min-h-screen sm:min-h-auto sm:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-6 sm:p-10 flex flex-col justify-center'>
              <div>
                  <div className='text-3xl font-semibold text-center mb-8 text-gray-800'>Login</div>
                  {
                    error && (
                              <div className="mb-4 text-sm text-red-900 bg-red-500/30 border border-red-400 rounded-lg px-3 py-2">
                                  {error}
                              </div>
                      )
                  }
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
                    <button 
                      disabled={loading}
                      className='w-full py-3 bg-sky-600 text-white rounded-lg text-lg hover:bg-sky-700 active:bg-sky-800 transition cursor-pointer'>{loading ? 'Logging in...' : 'Login'}</button>
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