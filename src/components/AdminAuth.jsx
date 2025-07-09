import { useEffect, useState } from "react";
import styles from "./css/AdminAuth.module.css";
import { NavLink } from 'react-router-dom';
export const AdminAuth = () => {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
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

  function base64EncodeUnicode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  }
  useEffect(() => {
    let isAuth = sessionStorage.getItem("isAuthenticated");
    let token = sessionStorage.getItem("authToken");
    if (isAuth) {
      setIsShowLoader(true);
      fetch("https://quiz-server-kkjt.onrender.com/all", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          if (res.status === 401) throw new Error("Unauthorized");
          if (!res.ok) throw new Error("Помилка сервера");
          return res.json();
        })
        .then((data) => {
          setIsShowLoader(false);
          setIsLogin(true);
          setQuizzes(data);
        })
        .catch((err) => {
          setError(err.message);
          setIsLogin(false);
          console.error("Помилка доступу:", err.message);
        });
    }
  }, []);
  const submit = (e) => {
    setIsShowLoader(true);
    e.preventDefault();
    setError(null);
    setQuizzes(null);

    const encoded = base64EncodeUnicode(`${login}:${pass}`);

    fetch("https://quiz-server-kkjt.onrender.com/all", {
      method: "GET",
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error("Помилка сервера");
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("authToken", `Basic ${encoded}`);
        setIsShowLoader(false);
        setIsLogin(true);
        setQuizzes(data);
      })
      .catch((err) => {
        setError(err.message);
        sessionStorage.removeItem("isAuthenticated", "true");
        sessionStorage.removeItem("authToken", `Basic ${encoded}`);
        setIsLogin(false);
        console.error("Помилка доступу:", err.message);
      });
  };
  const delHandler = (e) => {
    let urlDel = `https://quiz-server-kkjt.onrender.com/delete/${e.target.id}`;
    let newQuizzes = quizzes.filter((el) => el.code !== e.target.id);
    setQuizzes(newQuizzes);
    fetch(urlDel, {
      method: "DELETE",
    });
  };
  return (
    <div>
      <header className={styles.header}>
        <NavLink to='/' className={styles.title}>Quiz App</NavLink>
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
              value={pass}
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
