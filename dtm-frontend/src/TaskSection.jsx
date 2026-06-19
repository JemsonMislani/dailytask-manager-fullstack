import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useAuthForLogout } from "./logout";

export default function TaskSection(){
    const [section, setSection] = useState([])
    const [findsecId, setFindSecId] = useState(null)
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')
    const nav = useNavigate()
    const [task, setTask] = useState([])
    const [alltask, setAllTask] = useState([])
    const [open, setOpen] = useState(false)
    const { handleLogoutBtn } = useAuthForLogout()
    const [popup, setPopUp] = useState({
        show: false,
        message: '',
        type: ''
    })

    useEffect(() => {
    const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
    if(!token){
        return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/getSection`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(result => setSection(result.data))
    .catch(err => console.log(err))
}, [])

    const clickEdit = (sec) => {
        setFindSecId(sec.id)
        setTitle(sec.title)
        setNotes(sec.description)
    }

    const handleSaveBtn = (id) => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        axios.put(`${import.meta.env.VITE_API_URL}/editSection/` + id, {
            title: title, description: notes
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => {
            setSection(prev => prev.map(item => item.id === id
            ?
            result.data : item
            ))
            setFindSecId(null)
            setTitle('')
            setNotes('')
            popUpMessageForSection('Updated✅', 'success')
        })
        .catch(err => console.log(err))
    }

    const handleDelBtn = (id) => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        axios.delete(`${import.meta.env.VITE_API_URL}/deleteSection/` + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => {
            setSection(prev => prev.filter(sec => sec.id !== id))
            result
            popUpMessageForSection('Deleted⛔', 'error')
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if(!token){
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
    }, [])

    const popUpMessageForSection = (message, type) => {
        setPopUp({
            show: true,
            message,
            type
        })
        setTimeout(() => {
            setPopUp({
                show: false,
                message: '',
                type: ''
            })
        }, 2000)
    }


    return(
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
            <button onClick={handleLogoutBtn} className="block px-4 py-2 rounded hover:bg-gray-700">Logout ?</button>
          </nav>
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          © 2026 Jemson Mislani
          </div>
        </aside>
            <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6 sm:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl p-2 bg-gray-900 text-white rounded"
          >
            ☰
          </button>
        </div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Tasks sections📝</h1>
                <div>
                    { popup.show && (<p className={`popupmessage px-2 py-1 items-center rounded text-white 
                    ${popup.type === 'success' ? 'bg-green-700 border-green-300' : 
                      popup.type === 'error' ? 'bg-red-900 border-red-300' : 'bg-sky-700'
                    }`}>{popup.message}</p>)}
                </div>
            </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 place-items-stretch">
                    {section.map(sec => (
                        <div
                            key={sec.id}
                            className="mt-5 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between cursor-pointer w-full h-full min-h-[280px]"
                        >
                        <div 
                            className="flex items-center justify-center" style={{ flex: '0 0 auto' }}
                            >
                        <button 
                            className="text-1xl cursor-pointer"
                            onClick={() => nav(`/addtask/${sec.id}`)}>Add task ➕</button>
                        </div>
                        <div 
                            className="text-left border border-1 p-2 rounded bg-sky-800 text-white overflow-hidden">
                            {
                                findsecId === sec.id ? 
                                (<>
                                <input type="text"
                                    className="border border-1 mb-1 px-1 rounded" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}/>
                                    <textarea
                                        className="border border-1 px-1 rounded mr-6"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                    <button
                                        className="text-green-500 mr-1 cursor-pointer hover:bg-green-500 hover:text-white transition transform hover:scale-105"
                                        disabled={!title.trim()}
                                        onClick={() => 
                                        handleSaveBtn(sec.id)}><FaCheck /></button>
                                    <button
                                        className="text-red-400 hover:bg-red-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
                                        onClick={() => {
                                            setFindSecId(null)
                                            setTitle('')
                                            setNotes('')
                                        }}><FaTimes /></button>
                                </>) 
                                :
                                (<>
                                <div className="flex items-center justify-between">
                                <p className="font-bold truncate">Title: {sec.title}</p>
                                <div className="flex items-center gap-2">
                                    <button className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                                    onClick={() => clickEdit(sec)}>
                                    <FaEdit />
                                    </button>
                                    <button className="text-red-400 hover:text-red-300 cursor-pointer"
                                    onClick={() => handleDelBtn(sec.id)}>
                                    <FaTrash />
                                    </button>
                                </div>
                                </div>
                                </>)
                            }
                            {
                                findsecId !== sec.id && (
                                    <p className="truncate">
                                        Notes: {sec.description}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    ))}
                </div>
            </main>
      </div>
        </>
    );
}