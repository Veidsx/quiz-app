import { useEffect, useState } from "react";
import style from "./css/YourQuizes.module.css";
import { NavLink, useNavigate } from "react-router-dom";
export const YourTests = () => {
  const [quizes, setQuizes] = useState([]);
  const [codes, setCodes] = useState([]);
  const [isShow, setIsShow] = useState(false);
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
                <NavLink to='/'>Почати за кодом</NavLink>
                <NavLink to="/admin">{sessionStorage.getItem('isAuthenticated') ? 'Admin Panel' : 'Увійти'}</NavLink>
              </div>
            </header>
      {!isShow && (
        <div className={style.error}>
          <h1>Дружочок, в тебе ще нема тестів</h1>
          <NavLink to="/" className={style.back}>
            Перейти на головну сторінку
          </NavLink>
        </div>
      )}
      {isShow && (
        <div className={style.center_quizes}>
          {isDone && (
            <div className={style.quizes}>
              {quizes.map((quiz) => {
                const isDeleted = !codes.includes(quiz.code);

                if (!codes.includes(quiz.code)) {
                  let quizes = JSON.parse(localStorage.getItem("quizes"));
                  if (quizes) {
                    // let filter = quizes.filter((q) => q.code !== quiz.code);
                    // localStorage.setItem("quizes", JSON.stringify(filter));
                  }
                } 
                return (
                  <div key={crypto.randomUUID()} className={style.quiz}>
                    <p>Назва: {quiz.title}</p>
                    <p>{!isDeleted && "Код: " + quiz.code}</p>    
                    <p>{isDeleted && 'Цей тест був видалений адміном'}</p>
                    <div className={style.btns}>
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
