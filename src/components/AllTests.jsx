import { useEffect, useState } from "react";
import styles from "./css/AllQuizes.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export const AllTests = () => {
  let url = "https://quiz-server-kkjt.onrender.com/all";
  const urlA = `test?code=`;
  let [isShowLoader, setIsShowLoader] = useState(false);
  let [quizes, setQuizes] = useState([]);
  let [quizesRender, setQuizesRender] = useState([]);
  let [value, setValue] = useState("");
  let [placeholder, setPlace] = useState("Пошук");
  let [searchNotDefined, setSearchNotDefined] = useState(false);
  const changeInput = (e) => {
    setValue(e.target.value);
  };
  const searchHandler = () => {
    if (value === "") {
      setPlace("Введіть назву тесту");
      setTimeout(() => {
        setPlace("Пошук");
      }, 1000);
      return false;
    } else {
      setValue("");
    }

    let search_result = quizesRender.filter((quiz) =>
      quiz.title.replace(/\s/g, "").toLowerCase().includes(value.toLowerCase())
    );
    if (search_result.toString() === [].toString()) {
      setSearchNotDefined(true);
    } else {
      setSearchNotDefined(false);
    }
    setQuizes(search_result);
  };
  useEffect(() => {
    setIsShowLoader(true);

    const fetchTests = async (url) => {
      let response = await fetch(url);
      let data = await response.json();
      setIsShowLoader(false);
      setQuizes(data);
      setQuizesRender(data);
    };
    fetchTests(url);
  }, []);
  const navigate = useNavigate();
  const goTest = (e) => {
    navigate(`${urlA}${e.target.id}`);
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
          <NavLink to="/">Почати за кодом</NavLink>
          <NavLink to="/admin">
            {sessionStorage.getItem("isAuthenticated")
              ? "Адмін панель"
              : "Увійти"}
          </NavLink>
        </div>
      </header>
      <div className={styles.div_search}>
        <input
          type="text"
          placeholder={placeholder}
          className={styles.search}
          value={value}
          onChange={changeInput}
        />
        <button onClick={searchHandler}>Шукати</button>
      </div>
      {isShowLoader && (
        <div className={styles.center_loader}>
          <div className={styles.loader}></div>
        </div>
      )}
      {searchNotDefined && (
        <h1 className={styles.searchNot}>
          За вашим запитом нічого не знайдено
        </h1>
      )}
      <div className={styles.tests_center}>
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
    </div>
  );
};
