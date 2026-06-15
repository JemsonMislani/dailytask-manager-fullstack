import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function TaskCompleted() {
    const [section, setSection] = useState([])
    const [userId, setUserId] = useState(null)
    const [task, setTask] = useState([])
    const [alltask, setAllTask] = useState([])
    const nav = useNavigate()

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
        axios.get('http://localhost:3004/getSectionsWithCompleted?user_id=' + userId)
        .then(result => {
            setSection(result.data)
        })
        .catch(err => console.log(err))
    }, [userId])
    

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
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-5">Task completed ✅️</h1>
        {
            <div 
                className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(3in, max-content))' }}>
                {section.map(sec => (
                <div
                    key={sec.id}
                    className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition p-4 shadow-lg rounded flex flex-col justify-between cursor-pointer"
                    style={{ width: '3in', height: '1.5in' }}
                    onClick={() => nav(`/completedtasks/${sec.id}`)}
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