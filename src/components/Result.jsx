import styles from "./css/Result.module.css";
import style from "./css/Header.module.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
export const Result = () => {
  let length = JSON.parse(localStorage.getItem("result"))[0];
  let correctAnswers = JSON.parse(localStorage.getItem("result"))[1];
  const [width, setWidth] = useState(0);
  const divRef = useRef();
  useEffect(() => {
    setWidth(parseFloat(getComputedStyle(divRef.current).width));
  }, []);

  let newWidth = width * (correctAnswers / length);
  let mark = (correctAnswers / length) * 12;

  newWidth === Infinity ? (newWidth = 0) : newWidth;
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility((prev) => !prev);
  };
  let quiz = JSON.parse(localStorage.getItem("quiz-for-result"));

  return (
    <div className={`${visibility ? style.active_body : ""}`}>
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
                }}
              >
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
          <h1 className={styles.title2}>{quiz.title}</h1>
          <p className={styles.author}>Автор:{quiz.author}</p>
          <div className={styles.bottom}>
            <p className={styles.mark}>Оцінка:{Math.round(mark)}</p>
            <p>
              Правильні відповіді:
              {correctAnswers.length > 1
                ? correctAnswers.toFixed(1)
                : correctAnswers}
              / {length}
            </p>
            <div className={styles.bar} ref={divRef}>
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
          <div className={styles.questions}>
            {quiz.questions.map((question) => {
              return (
                <div className={styles.question} key={crypto.randomUUID()}>
                  <h2>
                    {question.numberQuestion}: {question.title}
                  </h2>
                  <div className={styles.variants}>
                    {quiz.questions[question.numberQuestion - 1].variants.map(
                      (variant) => {
                        variant.isCorrect
                          ? (variant.value += "(Правильна відповідь✅)")
                          : (variant.value += "❌");
                        variant.choice
                          ? (variant.value += "(Ваш вибір)")
                          : variant.value;

                        return <p key={variant.value}>{variant.value}</p>;
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <NavLink
            to="/"
            className={styles.backHome}
            onClick={() => {
              localStorage.removeItem("result");
            }}
          >
            Повернутись на головний екран
          </NavLink>
        </div>
      </div>
    </div>
  );
};
