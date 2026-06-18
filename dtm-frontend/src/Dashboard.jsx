import { useState } from "react"
import { useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const [section, setSection] = useState([])
  const [showinp, setShowInp] = useState(false)
  const [userId, setUserId] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [alltask, setAllTask] = useState([])
  const [task, setTask] = useState([])
  const [popup, setPopUp] = useState(false)
  const [open, setOpen] = useState(false);  

  const handleAddSecBtn = () => {
    if(!title || !desc){
      alert('Please fill out fields')
      return false
    }
    return true
  }

  const addSectionTitle = () => {
    const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
    axios.post('http://localhost:3004/createSection', {
      title: title, description: desc
    }, { headers: {
      Authorization: `Bearer ${token}`
    }})
    .then(result => {
      setSection(prev => [...prev, result.data])
      setTitle('')
      setDesc('')
      setShowInp(false)
      setPopUp(true)

      setTimeout(() => {
        setPopUp(false)
      }, 2000)
    })
    .catch(err => console.log(err))
  }

    useEffect(() => {
      const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
    if(token){
      const decoded = jwtDecode(token)
      setUserId(decoded.id)
    }
  }, [])

    useEffect(() => {
      const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
      if(!userId){
        return
      }
        axios.get('http://localhost:3004/getTask', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
          setAllTask(result.data)
          const completedTask = result.data.filter(t => t.completed === true)
          setTask(completedTask)
        })
      .catch(err => console.log(err))
    }, [userId])

    

  return (
    <>
      <div className="flex h-screen bg-gray-100">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
        <aside className={`
            fixed sm:static z-50 top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}>
          <div className="text-2xl font-bold p-6 border-b border-gray-700">My Dashboard</div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to={'/success'} className="block px-4 py-2 rounded hover:bg-gray-700">Home</Link>
            <Link to={'/tasksection'}className="block px-4 py-2 rounded hover:bg-gray-700">Task section</Link>
            <Link to={'/completedtaskpage'} className="block px-4 py-2 rounded hover:bg-gray-700" >Task Completed :
              <label className="text-white m-1 p-1 border px-3 rounded-2xl bg-green-700 font-bold">{task.length}</label>
            </Link>
            <Link to={'/pendingtaskpage'} className="block px-4 py-2 rounded hover:bg-gray-700">Task pending : 
              <label className="text-white m-1 p-1 border px-3 rounded-2xl bg-sky-700 font-bold">{alltask.filter(t => !t.completed).length}</label>
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          © 2026 Jemson Mislani
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6 sm:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl p-2 bg-gray-900 text-white rounded"
          >
            ☰
          </button>
        </div>
          <h1 className="text-2xl font-semibold">Welcome, you can create a section for your list of tasks!📝</h1>
          <p className="mt-2 text-gray-600">Small tasks everyday, add up to big results.✅️</p> 
          <div className="flex items-center mt-6 gap-2">
            <button 
            className="px-4 py-4 rounded ml-0 cursor-pointer bg-sky-400 hover:bg-sky-500 active:bg-sky-400"
            onClick={() => setShowInp(!showinp)}
            >Add Section ✚
            </button>
            {popup && (<span className="px-2 py-1 rounded bg-green-700 text-white text-sm">Added to section ✅️</span>)}
          </div>
            <div>
                {
                  showinp && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4">
                      <input 
                        className="border px-3 py-2 rounded w-full sm:flex-1 min-w-0 sm:max-w-xs"
                        type="text" 
                        placeholder="Enter section name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}/>
                      <input 
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                        type="text" 
                        placeholder="Enter description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}/>
                      <button
                        className="bg-green-700 px-6 py-2 text-white rounded hover:bg-green-800 cursor-pointer"
                        onClick={(e) => { 
                          e.preventDefault();
                         if(handleAddSecBtn()){
                          addSectionTitle();
                         }
                        }}>Add</button>
                      <button
                        className="bg-red-700 px-6 py-2 text-white rounded hover:bg-red-800 cursor-pointer"
                        onClick={() => setShowInp(false)}>Close</button>
                    </div>
                  )
                }
            </div>
        </main>
      </div>
    </>
  )
}

