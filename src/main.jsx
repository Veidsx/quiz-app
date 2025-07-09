import { createRoot } from 'react-dom/client'
import './components/css/main.css'
import { Layout } from './components/Layout'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateTest } from './components/CreateTest'
import { StartTest } from './components/StartTest';
import { Result } from './components/Result';
import { TestCreatePage } from './components/DoneTestPage';
import { YourTests } from './components/YourTests';
import { EditTest } from './components/EditTest';
import { AllTests } from './components/AllTests'
import { AdminAuth } from './components/AdminAuth'
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/quiz-app/">
    <Routes>
      <Route path="/" element={<Layout />}/>
      <Route path='/create-test' element={<CreateTest/>}/>
      <Route path='/test' element={<StartTest/>}/>
      <Route path='/result' element={<Result/>}/>
      <Route path='/done-test' element={<TestCreatePage/>}/>
      <Route path='/your-tests' element={<YourTests/>}/>
      <Route path='/edit-test' element={<EditTest/>}/>
      <Route path='/all-tests' element={<AllTests/>}/>
      <Route path='/admin' element={<AdminAuth/>}/>
    </Routes>
  </BrowserRouter>
)
