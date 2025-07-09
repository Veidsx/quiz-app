import { useEffect, useState } from "react";
import style from "./css/YourQuizes.module.css";
import { NavLink, useNavigate } from "react-router-dom";
export const YourQuizes = () => {
  // const [isRender, setIsRender] = useState(false);
  const quizes = JSON.parse(localStorage.getItem("quizes"));
  const navigate = useNavigate();

  return (
    <div>
      <header className={style.header}>
        <NavLink to='/' className={style.title}>Quiz App</NavLink>
      </header>
      {quizes === null && (
        <div className={style.error}>
          <h1>Дружочок, в тебе ще нема тестів</h1>
          <NavLink to='/' className={style.back}>Перейти на головну сторінку</NavLink>
        </div>
      )}
      {quizes !== null && (
        <div>
          <header className={style.header}>
            <NavLink className={style.title} to="/">
              Quiz App
            </NavLink>
          </header>
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
                      <button>Видалити</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
