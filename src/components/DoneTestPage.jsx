import style from "./css/DoneQuizPage.module.css";
import { NavLink } from "react-router-dom";
export const TestCreatePage = () => {
  const code = localStorage.getItem("code-for-info");
  const url = `/quiz-app/test?code=${code}`;
  const copyUrlHandler = (e) => {
    e.target.textContent = "Скопійовано";
    setTimeout(() => {
      e.target.textContent = "Копіювати посилання 📋";
    }, 1000);
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
  };
  return (
    <div>
      <header>
        <div>
          <img
            src="https://quiz-server-kkjt.onrender.com/icons/logo.png"
            alt="Logo"
            width="130px"
          />
          <NavLink to="/">Quiz App</NavLink>
        </div>
        <div>
          <NavLink to="/all-tests">Всі тести</NavLink>
          <NavLink to="/your-tests">Мої тести</NavLink>
          <NavLink to="/">Почати за кодом</NavLink>
          <NavLink to="/admin">
            {sessionStorage.getItem("isAuthenticated")
              ? "Адмін панель"
              : "Увійти"}
          </NavLink>
        </div>
      </header>
      <div className={style.center}>
        <div className={style.info}>
          <div className={style.title2}>
            <h1>Ваш тест успішно створено</h1>
            <p>Ваш тест доступний за кодом {code}</p>
            <p>
              Або за посиланням
              {
                <a href={url} className={style.url} target="_blank">
                  {" " + `${window.location.origin}${url}`}
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
