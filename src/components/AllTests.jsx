import { useEffect, useState } from "react";
import styles from "./css/AllQuizes.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export const AllTests = () => {
  let url = "https://quiz-server-kkjt.onrender.com/all";
  const urlA = `test?code=`;
  let [isShowLoader, setIsShowLoader] = useState(false);
  let [quizes, setQuizes] = useState([]);
  useEffect(() => {
    setIsShowLoader(true)
    
    const fetchTests = async (url) => {
      let response = await fetch(url);
      let data = await response.json();
      setIsShowLoader(false)
      setQuizes(data);
    };
    fetchTests(url);
  }, []);
  const navigate = useNavigate();
  const goTest = (e) => {
    navigate(`${urlA}${e.target.id}`);
  };
  return (
    <div>
      <header className={styles.header}>
        <NavLink to="/" className={styles.title}>
          Quiz App
        </NavLink>
      </header>
      {isShowLoader && (
            <div className={styles.center_loader}>
              <div className={styles.loader}></div>
            </div>
          )}
      <div className={styles.tests}>
        
        {quizes.map((quiz) => {
          return (
            <div key={quiz.code} className={styles.test}>
              <h2>Назва:{quiz.title}</h2>
              <h2>Автор:{quiz.author}</h2>
              <h3>Кількість запитань:{quiz.questions.length}</h3>
              <a
                className={styles.toTest}
                onClick={goTest}
                id={quiz.code}
                href={`${window.location.origin}/quiz-app/${urlA}${quiz.code}`}
              >
                Пройти тест
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
