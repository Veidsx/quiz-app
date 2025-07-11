import styles from "./css/StartQuiz.module.css";
import style from "./css/Header.module.css";
import { useState } from 'react'
import { NavLink } from "react-router-dom";
export const Result = () => {
  let length = JSON.parse(localStorage.getItem("result"))[0];
  let correctAnswers = JSON.parse(localStorage.getItem("result"))[1];
  let width = 288 + 140;
  let newWidth = width * (correctAnswers / length);
  let mark = (correctAnswers / length) * 12;

  newWidth === Infinity ? (newWidth = 0) : newWidth;
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility((prev) => !prev);
  };
  return (
    <div>
       <header className={style.header}>
        <div className={style.container}>
          <div className={style.left}>
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
              localStorage.removeItem("form_status");
            }}
            className={style.title}
          >
            Quiz App
          </NavLink>
          </div>
          <div
            onClick={changeVisibility}
            className={`${style.burger_menu} ${visibility ? style.active : ""}`}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`${style.nav} ${visibility ? style.active_nav : ""}`}>
            <div className={style.nav_links}>
              <NavLink to="/all-tests">Всі тести</NavLink>
              <NavLink to="/your-tests">Мої тести</NavLink>
              <NavLink
                to="/"
                onClick={() => {
                  localStorage.setItem("form_status", "startCode");
                }}>
                Почати за кодом
              </NavLink>
              <NavLink to="/admin">
                {sessionStorage.getItem("isAuthenticated")
                  ? "Адмін панель"
                  : "Увійти"}
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.center_result}>
        <div className={styles.result}>
          <h1 className={styles.title2}>{localStorage.getItem("title")}</h1>
          <p className={styles.author}>Автор:{localStorage.getItem("author")}</p>
          <div className={styles.bottom}>
            <p className={styles.mark}>Оцінка:{Math.round(mark)}</p>
            <p>
              Правильні відповіді:{correctAnswers.toFixed(2)} / {length}
            </p>
            <div className={styles.bar}>
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
            className={styles.backHome}
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
