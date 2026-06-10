
export default function CreateTask() {
    return(
        <>
            <div className="flex justify-center items-center h-40">
                <h1 className="text-3xl">What's our task for today?</h1>
            </div>
            <div className="flex justify-center items-center h-30">
                <div className="flex gap-2 px-10 py-10 rounded shadow-sm bg-gray-100">
                    <input 
                        className="border border-1 px-10 pl-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="text" placeholder="Enter task" />
                    <input
                        className="border border-1 px-10 pl-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="date" />
                    <input 
                        className="border border-1 pl-2 pr-2 py-3 rounded focus:outline-none focus:border-blue-500  focus:ring-blue-200 transition"
                        type="time" />
                        <button className="border border-1 pl-5 pr-5 py-3 rounded bg-green-700 text-white cursor-pointer hover:bg-green-800 active:bg-green-700 ">Add Task</button>
                </div>
            </div>
        </>
    );
}
{/* <div className="flex gap-2 px-10 py-10 rounded-xl shadow-lg bg-gray-100">

    <input
        className="w-60 px-3 py-2 rounded-md border border-gray-300 
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
        transition"
        type="text"
        placeholder="Enter task"
    />

    <input
        className="px-3 py-2 rounded-md border border-gray-300 
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
        transition"
        type="date"
    />

    <input
        className="px-3 py-2 rounded-md border border-gray-300 
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
        transition"
        type="time"
    />

    <button
        className="px-5 py-2 rounded-md bg-green-600 text-white font-medium 
        hover:bg-green-700 active:bg-green-600 
        transition shadow-sm hover:shadow-md"
    >
        Add Task
    </button>

</div> */}