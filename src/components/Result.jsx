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
      <header className={style.header}>
        <NavLink className={style.title} to={"/"}>
          Quiz App
        </NavLink>
      </header>
      <div className={style.center_result}>
        <div className={style.result}>
          <h1 className={style.title2}>{localStorage.getItem("title")}</h1>
          <p className={style.author}>Автор:{localStorage.getItem("author")}</p>
          <div className={style.bottom}>
            <p className={style.mark}>Оцінка:{mark}</p>
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
        <NavLink to="/" className={style.backHome}>
          Повернутись на головний екран
        </NavLink>
        </div>
      </div>
    </div>
  );
};
