import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function TaskSection(){
    const [section, setSection] = useState([])

    useEffect(() => {
    axios.get('http://localhost:3004/getSection',)
    .then(result => setSection(result.data))
    .catch(err => console.log(err))
}, [])

    return(
        <>
     <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="text-2xl font-bold p-6 border-b border-gray-700">My Dashboard</div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to={'/success'} className="block px-4 py-2 rounded hover:bg-gray-700">Home</Link>
            <Link to={'/tasksection'}className="block px-4 py-2 rounded hover:bg-gray-700">Task section</Link>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700" >Task Completed</a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Task pending</a>
          </nav>
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          © 2026 Jemson Mislani
          </div>
        </aside>
            <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-semibold mb-5">Tasks sections📝</h1>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(3in, 1fr))' }}>
                    {section.map(sec => (
                    <div
                        key={sec.id}
                        className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition p-4 shadow-lg rounded flex flex-col justify-between cursor-pointer"
                        style={{ width: '3in', height: '3in' }}
                    >
                        <div className="flex items-center justify-center" style={{ flex: '0 0 auto' }}>
                        <button className="text-1xl cursor-pointer">Add task ➕</button>
                        </div>
                        <div className="text-left border border-1 p-2 rounded bg-sky-800 text-white overflow-hidden">
                        <p className="font-bold truncate">Title: {sec.title}</p>
                        <p className="truncate">Notes: {sec.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </main>
      </div>
        </>
    );
}