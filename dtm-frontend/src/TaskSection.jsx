import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function TaskSection(){
    const [section, setSection] = useState([])
    const [findsecId, setFindSecId] = useState(null)
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')
    const nav = useNavigate()
    const [userId, setUserId] = useState(null)
    const [task, setTask] = useState([])
    const [alltask, setAllTask] = useState([])

    useEffect(() => {
    axios.get('http://localhost:3004/getSection',)
    .then(result => setSection(result.data))
    .catch(err => console.log(err))
}, [])

    const clickEdit = (sec) => {
        setFindSecId(sec.id)
        setTitle(sec.title)
        setNotes(sec.description)
    }

    const handleSaveBtn = (id) => {
        axios.put('http://localhost:3004/editSection/' + id, {
            title: title, description: notes
        })
        .then(result => {
            setSection(prev => prev.map(item => item.id === id
            ?
            result.data : item
            ))
            setFindSecId(null)
            setTitle('')
            setNotes('')
        })
        .catch(err => console.log(err))
    }

    const handleDelBtn = (id) => {
        axios.delete('http://localhost:3004/deleteSection/' + id)
        .then(result => {
            setSection(prev => prev.filter(sec => sec.id !== id))
            console.log(result)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if(token){
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
    }, [])

    useEffect(() => {
      if(!userId){
        return
      }
        axios.get('http://localhost:3004/getTask?user_id=' + userId)
        .then(result => {
          setAllTask(result.data)
          const completedTask = result.data.filter(t => t.completed === true)
          setTask(completedTask)
        })
      .catch(err => console.log(err))
    }, [userId])

    return(
        <>
     <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
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
            <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-semibold mb-5">Tasks sections📝</h1>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(3in, max-content))' }}>
                    {section.map(sec => (
                    <div
                        key={sec.id}
                        className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition p-4 shadow-lg rounded flex flex-col justify-between cursor-pointer"
                        style={{ width: '3in', height: '3in' }}
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