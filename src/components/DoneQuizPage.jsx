import style from "./css/DoneQuizPage.module.css";
import { NavLink } from "react-router-dom";
export const QuizCreatePage = () => {
  const code = localStorage.getItem("code-for-info");
  const url = `/quiz-app/test?code=${code}`;
  const copyUrlHandler = (e) => {
    e.target.textContent = 'Скопійовано'
    setTimeout(() => {
      e.target.textContent = 'Копіювати посилання 📋'
    }, 1000)
    navigator.clipboard.writeText(`${window.location.origin}${url}`)
  }
  return (
    <div>
      <header className={style.header}>
        <NavLink to="/" className={style.title}>
          Quiz App
        </NavLink>
      </header>
      <div className={style.center}>
        <div className={style.info}>
          <div className={style.title2}>
            <h1>Ваш тест успішно створено</h1>
            <p>Ваш тест доступний за кодом {code}</p>
            <p>
              Або за посиланням 
              {
                <a href={url} className={style.url} target='_blank'>
                  {' ' + `${window.location.origin}${url}`}
                </a>
              }
            </p>
          </div>
            <button className={style.btn_copy} onClick={copyUrlHandler}>
              Копіювати посилання 📋
            </button>
          <NavLink to="/" className={style.backHome}>
            Повернутись на головний екран
          </NavLink>
        </div>
      </div>
    </div>
  );
};
