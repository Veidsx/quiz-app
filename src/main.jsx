import { createRoot } from 'react-dom/client'
import { Layout } from './components/Layout'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateQuiz } from './components/CreateQuiz'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path='/create-quiz' element={<CreateQuiz isUpdateUrl={localStorage.getItem('code-create') ? false : true} />}/>
    </Routes>
  </BrowserRouter>
)
