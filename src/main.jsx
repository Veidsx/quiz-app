import { createRoot } from 'react-dom/client'
import './components/css/main.css'
import { Layout } from './components/Layout'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateQuiz } from './components/CreateQuiz'
import { StartQuiz } from './components/StartQuiz';
import { Result } from './components/Result';
import { QuizCreatePage } from './components/DoneQuizPage';
import { YourQuizes } from './components/YourQuizes';
import { EditQuiz } from './components/EditQuiz';
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/quiz-app/">
    <Routes>
      <Route path="/" element={<Layout />}/>
      <Route path='/create-quiz' element={<CreateQuiz/>}/>
      <Route path='/test' element={<StartQuiz/>}/>
      <Route path='/result' element={<Result/>}/>
      <Route path='/done-quiz' element={<QuizCreatePage/>}/>
      <Route path='/your-tests' element={<YourQuizes/>}/>
      <Route path='/edit-quiz' element={<EditQuiz/>}/>
    </Routes>
  </BrowserRouter>
)
