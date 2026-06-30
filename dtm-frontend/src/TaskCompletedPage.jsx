import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useAuthForLogout } from "./logout";

export default function TaskCompleted() {
    const [section, setSection] = useState([])
    const [userId, setUserId] = useState(null)
    const [task, setTask] = useState([])
    const [alltask, setAllTask] = useState([])
    const [open, setOpen] = useState(false)
    const nav = useNavigate()
    const { handleLogoutBtn, loading } = useAuthForLogout()

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if(token){
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
    }, [])

    useEffect(() => {
      const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
      if(!userId){
        return
      }
        axios.get(`${import.meta.env.VITE_API_URL}/getSectionsWithCompleted`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
            setSection(result.data)
        })
        .catch(err => console.log(err))
    }, [userId])
    

    useEffect(() => {
      const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
      if(!userId){
        return
      }
        axios.get(`${import.meta.env.VITE_API_URL}/getTask`, {
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

    return(
        <>
      {
        loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
      }
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
            <button onClick={handleLogoutBtn} className="block px-4 py-2 rounded hover:bg-gray-700">Logout ?</button>
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
          <h1 className="text-2xl font-semibold mb-5">Task completed ✅️</h1>
        {
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
                {section.map(sec => (
                <div
                    key={sec.id}
                    className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition p-4 shadow-lg rounded flex flex-col justify-between cursor-pointer w-full h-[180px]"
                    onClick={() => nav(`/completedtaskslists/${sec.id}`)}
                >
                <div>
                    <h1 className="font-bold text-lg">{sec.title}</h1>
                    <p className="text-gray-600 text-sm">{sec.description}</p>
                </div>
                <div className="mt-2">
                    <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-bold">View Tasks</span>
                </div>
                </div>
                ))}
            </div>
        }
        </main>
      </div>
        </>
    );
}