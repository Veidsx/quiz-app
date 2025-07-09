import { useEffect, useState } from 'react'
import style from "./css/YourQuizes.module.css";
import { NavLink, useNavigate } from "react-router-dom";
export const YourQuizes = () => {
  let quizes = JSON.parse(localStorage.getItem("quizes"));
  const [isShow, setIsShow] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if(quizes[0] === undefined){
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [quizes])
  const deleteQuiz = async (e) => {
    
    const url = `https://quiz-server-kkjt.onrender.com/delete/${e.target.id}`
    fetch(url, {
      method:'DELETE'
    })
    
    let filtered = quizes.filter((quiz) => quiz.code !== e.target.id)
    localStorage.setItem('quizes', JSON.stringify(filtered))
    quizes = JSON.parse(localStorage.getItem('quizes'))
  }
  return (
    <div>
      <header className={style.header}>
        <NavLink to='/' className={style.title}>Quiz App</NavLink>
      </header>
      {!isShow && (
        <div className={style.error}>
          <h1>Дружочок, в тебе ще нема тестів</h1>
          <NavLink to='/' className={style.back}>Перейти на головну сторінку</NavLink>
        </div>
      )}
      {isShow && (
          <div className={style.center_quizes}>
            <div className={style.quizes}>
              {quizes.map((quiz) => {
                return (
                  <div key={crypto.randomUUID()} className={style.quiz}>
                    <p>{quiz.title}</p>
                    <p>{quiz.code}</p>
                    <p>{quiz.author}</p>
                    <div className={style.btns}>
                      <button
                        onClick={() => {
                          localStorage.setItem("edit-quiz", quiz.code);
                          navigate("/edit-quiz");
                        }}
                      >
                        Редагувати
                      </button>
                      <button onClick={deleteQuiz} id={quiz.code}>Видалити</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      )}
    </div>
  );
};
