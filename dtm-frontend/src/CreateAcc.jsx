import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import './LoginAcc.css'

export default function CreateAcc() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  
  const [showpass, setShowPass] = useState(false)

  const handleSubmitBtn = (e) => {
    e.preventDefault()
    if(!email || !password){
      alert('Please fill out fields')
      return
    }

    setError('');
    setLoading(true)
    axios.post(`${import.meta.env.VITE_API_URL}/createAcc`, {
      email: email, password: password
    })
    .then(result => {
      setUser(result.data)
      localStorage.setItem('userstokens', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      setEmail('')
      setPassword('')
      alert('Account created successfully!')
      nav('/')
    })
    .catch(err => {
        setError(err.response?.data?.message || 'Email already used')
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
            onSubmit={handleSubmitBtn}
            className={`w-full max-w-md sm:p-4 transition-opacity duration-300 ${
                loading ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
          <div className='w-full min-h-screen sm:min-h-auto sm:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-6 sm:p-10 flex flex-col justify-center'>
              <div>
                  <div className='text-3xl font-semibold text-center mb-8 text-gray-800'>Signup</div>
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
                  <div className='relative'>
                  <input
                    className='w-full py-3 px-3 bg-white/80 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500' 
                    type={showpass ? 'text' : 'password'} 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    <div 
                    className='absolute top-3.5 right-4 text-2xl cursor-pointer text-sky-900'
                    onClick={() => setShowPass(!showpass)}>
                    {showpass ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  </div>
                    <button 
                      disabled={loading}
                      className='w-full py-3 bg-sky-600 text-white rounded-lg text-lg hover:bg-sky-700 active:bg-sky-800 transition cursor-pointer'>{loading ? 'Signing in...' : 'Submit'}</button>
                    <div className='flex justify-center'>
                      <Link 
                        className='text-center text-sm text-sky-700 hover:text-sky-900'
                        to='/'>Back to login</Link>
                    </div>
                  </div>
              </div>
          </div>
        </form>
      </div>
    </>
  )
}

