import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


export default function CreateTask() {
    const [task, setTask] = useState([])
    const [userId, setUserId] = useState(null)
    const [secId, setSecId] = useState(null)
    const [todo, setTodo] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    return(
        <>
            <div className="flex justify-center items-center h-40">
                <h1 className="text-3xl">What's our task for today?</h1>
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
                        >Add Task</button>
                </div>
            </div>
        </>
    );
}