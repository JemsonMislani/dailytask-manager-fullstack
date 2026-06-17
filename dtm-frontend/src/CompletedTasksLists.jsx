import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

export default function CompletedTasksLists(){
    const [userId, setUserId] = useState(null)
    const [task, setTask] = useState([])
    const { section_id } = useParams()

    useEffect(() => {
        const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
        if(token){
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
    }, [])

    useEffect(() => {
      const token = localStorage.getItem('userstokens') || sessionStorage.getItem('userstokens');
      if(!userId || !section_id){
        return
      }
        axios.get('http://localhost:3004/getTask', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => {
          const completedTask = result.data.filter(t => t.completed === true && t.section_id === Number(section_id))
          setTask(completedTask)
        })
      .catch(err => console.log(err))
    }, [userId, section_id])

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

    return(
        <>
            <div className="min-h-screen flex flex-col items-center pt-10 bg-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Completed tasks lists
                </h1>

                <div className="w-full max-w-md flex flex-col gap-3">
                    {task.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-between">
                        <p className="text-gray-700 text-base m-0 font-bold">
                              {t.task_name} - {formatDate(t.due_date)} - {formatTime(t.due_time)}
                        </p>
                        <span>✅</span>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    );
}