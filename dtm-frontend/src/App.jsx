import { BrowserRouter, Routes, Route} from 'react-router-dom'
import CreateAcc from './CreateAcc'
import LoginAcc from './LoginAcc'
import Dashboard from './Dashboard'
import TaskSection from './TaskSection'
import CreateTask from './CreateTask'
import TaskCompleted from './TaskCompletedPage'
import TaskPending from './TaskPendingPage'
import CompletedTasksLists from './CompletedTasksLists'
import PendingTasksLists from './PendingTasksLists'

export default function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginAcc />}/>
      <Route path='/create' element={<CreateAcc />}/>
      <Route path='/success' element={<Dashboard />}/>
      <Route path='/tasksection' element={<TaskSection />}/>
      <Route path="/addtask/:section_id" element={<CreateTask />} />
      <Route path='/completedtaskpage' element={<TaskCompleted />}/>
      <Route path='/pendingtaskpage' element={<TaskPending />}/>
      <Route path='/completedtaskslists/:section_id' element={<CompletedTasksLists />}/>
      <Route path='/pendingtaskslists/:section_id' element={<PendingTasksLists/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

