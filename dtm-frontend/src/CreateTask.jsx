import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";


export default function CreateTask() {
    const [task, setTask] = useState([])
    const [userId, setUserId] = useState(null)
    const [todo, setTodo] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const { section_id } = useParams()
    const [getTitle, setGetTitle] = useState('')
    const [findId, setFindId] = useState(null)
    const [editTodo, setEditTodo] = useState('')
    const [editDate, setEditDate] = useState('')
    const [editTime, setEditTime] = useState('')
    const [popup, setPopUp] = useState({
        show: false,
        message: '',
        type: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if (!section_id) 
            return;
        axios.get('http://localhost:3004/getTask/' + section_id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => {
            setTask(result.data)
        })
        .catch(err => console.log(err))
    }, [section_id])

    const addTaskBtn = (e) => {
        e.preventDefault()
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if(!todo || !date || !time){
            alert('Please fill out all fields')
            return
        }
        axios.post('http://localhost:3004/createTask', {
            section_id: Number(section_id),
            task_name: todo,
            due_date: date,
            due_time: time,
            completed: false
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        .then(() => {
        return axios.get('http://localhost:3004/getTask/' + section_id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })

        .then(result => {
            setTask(result.data)
            setTodo('')
            setDate('')
            setTime('')
            popUpMessageForTask('Task Added✅', 'success')
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');

        if(token){
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
        }, []);

    const formatTime = (time) => {
        if (!time) return '';
        const timeStr = typeof time === 'string' ? time : '00:00:00';
        return new Date(`1999-02-11T${timeStr}`).toLocaleTimeString('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (date) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        });
    };

        useEffect(() => {
            const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
            axios.get('http://localhost:3004/getSection/' + section_id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(result => {
                setGetTitle(result.data.title)
            })
            .catch(err => console.log(err))
        }, [])

        const clickEdit = (t) => {
            setFindId(t.id)
            setEditTodo(t.task_name)
            setEditDate(t.due_date)
            setEditTime(t.due_time?.slice(0, 5))
        }

        const handleSaveBtn = (id) => {
            const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
            const currentTask = task.find(t => t.id === id)
            if(editTodo === currentTask.task_name &&
                editDate === currentTask.task_date &&
                editTime === currentTask.task_time
            ) {
                setFindId(null)
                return
            }
            axios.put('http://localhost:3004/updateTask/' + id, {
                task_name: editTodo,
                due_date: editDate, 
                due_time: editTime,
                completed: false
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(result => {
                setTask(prev => prev.map(t => t.id === id 
                    ?
                result.data : t
                ))
                setFindId(null)
                setEditTodo('')
                setEditDate('')
                setEditTime('')
                popUpMessageForTask('Task updated✅', 'success')
            })
            .catch(err => console.log(err))
        }
        
        const handleCompletedBtn = (id) => {
            const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
            const toUpdate = task.find(tu => tu.id === id)
            axios.put('http://localhost:3004/updateTask/' + id, {
                task_name: toUpdate.task_name, 
                due_date: toUpdate.due_date, 
                due_time: toUpdate.due_time, 
                completed: !toUpdate.completed
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(result => {
                setTask(prev => prev.map(t => t.id === id 
                    ?
                result.data : t
                ))
                popUpMessageForTask(toUpdate.completed ? 'Task Undo✅' : 'Task completed✅',  'success')
            })
            .catch(err => console.log(err))
        }

        const handleDeleteBtn = (id) => {
            const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
            axios.delete('http://localhost:3004/deleteTask/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(result => {
                setTask(prev => prev.filter(t => t.id !== id))
                result.data
                popUpMessageForTask('Task deleted⛔', 'error')
            })
            .catch(err => console.log(err))
        }

        const popUpMessageForTask =(message, type) => {
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
            <div className="relative flex justify-end items-end">
                <div className="absolute top-0 right-0 m-5">
                    { popup.show && (<p className={`popupmessage px-2 py-1 items-center rounded text-white ${
                        popup.type === 'success' ? 'bg-green-700 border-green-300' : 
                        popup.type === 'error' ? 'bg-red-900 border-red-300' : 'bg-sky-700'
                    }`}>{popup.message}</p>)}
                </div>
            </div>
            <div className="flex justify-center items-center h-40">
                <h1 className="text-3xl">What's our task for <span className="font-semibold">{getTitle}</span> today?</h1>
            </div>
            <div className="flex justify-center items-center h-30">
                <div className="flex gap-2 px-10 py-10 rounded shadow-sm bg-gray-100">
                    <input 
                        className="border border-1 px-10 pl-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="text" placeholder="Enter task" 
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}/>
                    <input
                        className="border border-1 px-10 pl-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}/>
                    <input 
                        className="border border-1 pl-2 pr-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}/>
                        <button className="border border-1 pl-5 pr-5 py-3 rounded bg-green-700 text-white cursor-pointer hover:bg-green-800 active:bg-green-700 "
                        onClick={addTaskBtn}>Add Task</button>
                </div>
            </div>
            <div className="m-10 mr-auto ml-auto w-230">
                {
                    task.map((t) => (
                    <div 
                        key={t.id}
                        className="flex justify-center items-center">
                        {
                            findId === t.id ? 
                            (<>
                            <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-1 items-center w-full max-w-4xl mb-1 p-2 rounded bg-gray-100 font-semibold">
                                <input 
                                    className="border p-2 rounded"
                                    type="text" 
                                    value={editTodo}
                                    onChange={(e) => setEditTodo(e.target.value)}/>
                                <input 
                                    className="border p-2 rounded"
                                    type="date"
                                    value={editDate} 
                                    onChange={(e) => setEditDate(e.target.value)}/>
                                <input 
                                    className="border p-2 rounded"
                                    type="time"
                                    value={editTime} 
                                    onChange={(e) => setEditTime(e.target.value)}/>
                                <div>                                    <button        
                                        className="text-green-700 mr-1 cursor-pointer hover:bg-green-700 hover:text-white transition transform hover:scale-105 py-2 px-4 rounded"
                                        onClick={() => handleSaveBtn(t.id)}>save</button>
                                    <button 
                                        className="text-red-700 hover:bg-red-700 hover:text-white transition transform hover:scale-105 cursor-pointer py-2 px-4 rounded"
                                        onClick={() => setFindId(null)}>close</button>
                                </div>
                            </div>
                            </>) 
                            : 
                            (<>
                        <div
                            className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-1 items-center w-full max-w-4xl mb-1 p-2 rounded bg-gray-100"
                        >
                            <span 
                                className="font-semibold rounded p-2 bg-gray-300"
                                style={{
                                textDecoration: t.completed ? 'line-through' : 'none',
                                color: t.completed ? '#585c63' : '#111827'
                            }}>
                                {t.task_name} • {formatDate(t.due_date)} • {formatTime(t.due_time)}
                            </span>

                            <button 
                                className="py-2 bg-sky-500 text-white rounded cursor-pointer hover:bg-sky-700 active:bg-sky-500"
                                onClick={() => clickEdit(t)}>Edit</button>
                            <button 
                                className="py-2 bg-green-700 text-white rounded cursor-pointer hover:bg-green-900 active:bg-green-700"
                                onClick={() => handleCompletedBtn(t.id)}>{t.completed ? 'Undo Task' : 'Completed'}</button>
                            <button 
                                className="py-2 bg-red-700 text-white rounded cursor-pointer hover:bg-red-900 active:bg-red-700"
                                onClick={() => handleDeleteBtn(t.id)}>Delete</button>
                        </div>
                            </>)
                        }
                    </div>
                    ))
                }
            </div>
        </>
    );
}