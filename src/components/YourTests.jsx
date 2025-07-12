import { useEffect, useState } from "react";
import styles from "./css/YourQuizes.module.css";
import style from "./css/Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";
export const YourTests = () => {
  const [quizes, setQuizes] = useState([]);
  const [codes, setCodes] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCode = async () => {
      let response = await fetch("https://quiz-server-kkjt.onrender.com/codes");
      let data = await response.json();
      setIsDone(true);
      setCodes(data);
      const storedQuizes = JSON.parse(localStorage.getItem("quizes")) || [];

      setQuizes(storedQuizes);
      setIsShow(storedQuizes.length > 0);
    };
    fetchCode();
  }, []);

  const deleteQuiz = async (e) => {
    const quizId = e.target.id;
    const url = `https://quiz-server-kkjt.onrender.com/delete/${quizId}`;
    fetch(url, {
      method: "DELETE",
    });

    let filtered = quizes.filter((quiz) => quiz.code !== e.target.id);
    localStorage.setItem("quizes", JSON.stringify(filtered));
    setQuizes(filtered);
    setIsShow(filtered.length > 0);
  };
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility((prev) => !prev);
  };
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
              className={style.title}
              onClick={() => {
                localStorage.removeItem("form_status");
              }}
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
      {!isShow && (
        <div className={styles.error}>
          <h1>Дружочок, в тебе ще нема тестів</h1>
          <NavLink to="/" className={styles.back}>
            Перейти на головну сторінку
          </NavLink>
        </div>
      )}
      {isShow && (
        <div className={styles.center_quizes}>
          {isDone && (
            <div className={styles.quizes}>
              {quizes.map((quiz) => {
                const isDeleted = !codes.includes(quiz.code);

                if (!codes.includes(quiz.code)) {
                  let quizes = JSON.parse(localStorage.getItem("quizes"));
                } 
                return (
                  <div key={crypto.randomUUID()} className={styles.quiz}>
                    <p>Назва: {quiz.title}</p>
                    <p>{!isDeleted && "Код: " + quiz.code}</p>    
                    <p>{isDeleted && 'Цей тест був видалений адміністратором'}</p>
                    <div className={styles.btns}>
                      {!isDeleted && (
                        <button
                          onClick={() => {
                            localStorage.setItem("edit-quiz", quiz.code);
                            navigate("/edit-test");
                          }}
                        >
                          Редагувати
                        </button>
                      )}

                      <button onClick={deleteQuiz} id={quiz.code}>
                        Видалити
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
