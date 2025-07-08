import style from "./css/StartQuiz.module.css";
import { NavLink } from 'react-router-dom';
export const Result = () => {
  let length = JSON.parse(localStorage.getItem("result"))[0];
  let correctAnswers = JSON.parse(localStorage.getItem("result"))[1];
  let width = 288 + 140;
  let newWidth = width * (correctAnswers / length);

  newWidth === Infinity ? (newWidth = 0) : newWidth;

  return (
    <div>
      <header className={style.header}>
        <NavLink className={style.title} to={'/'}>Quiz App</NavLink>
      </header>
      <div className={style.result}>
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
    </div>
  );
};
