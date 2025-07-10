import { useEffect, useState } from "react";
import styles from "./css/AdminAuth.module.css";
import style from "./css/Header.module.css";
import { NavLink } from "react-router-dom";

export const AdminAuth = () => {
  const [login, setLogin] = useState("");
  const [userPassword, setPass] = useState("");
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  let [isShowLoader, setIsShowLoader] = useState(false);
  const changeInputLogin = (e) => {
    setLogin(e.target.value);
  };

  const changeInputPass = (e) => {
    setPass(e.target.value);
  };

  useEffect(() => {
    let isAuth = sessionStorage.getItem("isAuthenticated");

    if (isAuth) {
      setIsShowLoader(true);
      async function fetchData() {
        let response = await fetch("https://quiz-server-kkjt.onrender.com/all");
        let data = await response.json();
        setQuizzes(data);
        setIsLogin(true);
        setIsShowLoader(false);
      }
      fetchData();
    }
  }, []);
  const submit = async (e) => {
    setIsShowLoader(true);
    e.preventDefault();
    setError(null);
    setQuizzes(null);

    const response = await fetch(
      "https://quiz-server-kkjt.onrender.com/auth-check",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login, password: userPassword }),
      }
    );

    const data = await response.json();

    if (data.authenticated) {
      const response2 = await fetch(
        "https://quiz-server-kkjt.onrender.com/all"
      );
      const data2 = await response2.json();
      setQuizzes(data2);
      sessionStorage.setItem("isAuthenticated", true);
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    setIsShowLoader(false);
  };
  const delHandler = (e) => {
    if (sessionStorage.getItem("allFetchSearch")) {
      const tests = JSON.parse(sessionStorage.getItem("allFetchSearch"));
      let newQuizzes = tests.filter((el) => el.code !== e.target.id);
      sessionStorage.setItem("allFetchSearch", newQuizzes);
    }
    let urlDel = `https://quiz-server-kkjt.onrender.com/delete/${e.target.id}`;
    let newQuizzes = quizzes.filter((el) => el.code !== e.target.id);
    setQuizzes(newQuizzes);
    fetch(urlDel, {
      method: "DELETE",
    });
  };
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
            <NavLink to="/" className={style.title}>Quiz App</NavLink>
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
              <NavLink to="/">Почати за кодом</NavLink>
              <NavLink to="/admin">
                {sessionStorage.getItem("isAuthenticated")
                  ? "Адмін панель"
                  : "Увійти"}
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.auth}>
        {!isLogin && (
          <form className={styles.form} onSubmit={submit}>
            <h1>Увійдіть</h1>
            <input
              type="text"
              placeholder="Логін"
              onChange={changeInputLogin}
              value={login}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={userPassword}
              onChange={changeInputPass}
              required
            />
            <button type="submit">Увійти</button>
          </form>
        )}

        {error && <p style={{ color: "red" }}>Помилка: {error}</p>}

        {isShowLoader && (
          <div className={styles.center_loader}>
            <div className={styles.loader}></div>
          </div>
        )}
        {isLogin && (
          <div className={styles.flex}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} className={styles.test}>
                <h2>Назва:{quiz.title}</h2>
                <h2>Автор:{quiz.author}</h2>
                <h2>Код:{quiz.code}</h2>
                <h3>Кількість запитань:{quiz.questions.length}</h3>
                <button
                  className={styles.del}
                  onClick={delHandler}
                  id={quiz.code}
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
