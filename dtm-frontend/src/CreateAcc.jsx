import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function CreateAcc() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmitBtn = (e) => {
    e.preventDefault()
    if(!email || !password){
      alert('Please fill out fields')
      return
    }
    axios.post('http://localhost:3004/createAcc', {
      email: email, password: password
    })
    .then(result => {
      setUser(result.data)
      setEmail('')
      setPassword('')
    })
    .catch(err => console.log(err))
  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-sky-100 to-orange-200 px-4'>
        <form onSubmit={handleSubmitBtn} className='w-full max-w-md'>
          <div className='w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 sm:p-10'>
              <div>
                  <div className='text-3xl font-semibold text-center mb-8 text-gray-800'>Signup</div>
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
                    <button className='w-full py-3 bg-sky-600 text-white rounded-lg text-lg hover:bg-sky-700 active:bg-sky-800 transition cursor-pointer'>Submit</button>
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

