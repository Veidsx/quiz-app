import style from "./css/StartQuiz.module.css";
import { NavLink } from "react-router-dom";
export const Result = () => {
  let length = JSON.parse(localStorage.getItem("result"))[0];
  let correctAnswers = JSON.parse(localStorage.getItem("result"))[1];
  let width = 288 + 140;
  let newWidth = width * (correctAnswers / length);
  let mark = (correctAnswers / length) * 12;

  newWidth === Infinity ? (newWidth = 0) : newWidth;

  return (
    <div>
      <header>
        <div>
          <img
            src="https://quiz-server-kkjt.onrender.com/icons/logo.png"
            alt="Logo"
            width="130px"
          />
          <NavLink
            to="/"
            onClick={() => {
              localStorage.removeItem("result");
              localStorage.removeItem("author");
              localStorage.removeItem("title");
            }}
          >
            Quiz App
          </NavLink>
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
      <div className={style.center_result}>
        <div className={style.result}>
          <h1 className={style.title2}>{localStorage.getItem("title")}</h1>
          <p className={style.author}>Автор:{localStorage.getItem("author")}</p>
          <div className={style.bottom}>
            <p className={style.mark}>Оцінка:{Math.round(mark)}</p>
            <p>
              Правильні відповіді:{correctAnswers} / {length}
            </p>
            <div className={style.bar}>
              <span
                style={{
                  width: newWidth,
                  backgroundColor: "green",
                  display: "block",
                  height: 14,
                }}
              ></span>
              <span
                style={{
                  width: width - newWidth,
                  backgroundColor: "red",
                  display: "block",
                  height: 14,
                }}
              ></span>
            </div>
          </div>
          <NavLink
            to="/"
            className={style.backHome}
            onClick={() => {
            localStorage.removeItem("result")
            localStorage.removeItem("author")
            localStorage.removeItem("title")
          }}
          >
            Повернутись на головний екран
          </NavLink>
        </div>
      </div>
    </div>
  );
};
