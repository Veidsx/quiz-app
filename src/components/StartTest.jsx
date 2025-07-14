import styles from "./css/StartQuiz.module.css";
import style from "./css/Header.module.css";
import checkbox from "./css/CheckBox2.module.css";
import { useState, useEffect } from "react";
import { Result } from "./Result";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

export const StartTest = () => {
  let code = localStorage.getItem("code-for-start");
  let [title, setTitle] = useState("");
  let [variants, setVariants] = useState([]);
  let [quiz_length, setQuizLenght] = useState(0);
  let [numQuestion, setNumQuestion] = useState(1);
  let [isShowResult, setIsShowResult] = useState(false);
  let [correctAnswers, setCorrectAnswers] = useState(0);
  let [quiz, setQuiz] = useState("");
  let [isShowLoader, setIsShowLoader] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  let [isMultiple, setIsMultiple] = useState(false);
  let [multipleAnswersCorrect, setMultipleAnswersCorrect] = useState(0);
  let [isDisabled, setDisabled] = useState(true);
  let [answers, setAnswers] = useState([]);
  let [isShowBtn, setIsShowBtn] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsShowLoader(true);

        const url = searchParams.has("code")
          ? `https://quiz-server-kkjt.onrender.com/get/${searchParams.get(
              "code"
            )}`
          : `https://quiz-server-kkjt.onrender.com/get/${code}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        setQuiz(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsShowLoader(false);
      }
    };

    fetchQuiz();
  }, []);

  useEffect(() => {
    changeQuestion(quiz);
  }, [numQuestion, quiz]);

  let changeQuestion = () => {
    if (!searchParams.has("code") && quiz) {
      const params = new URLSearchParams();
      params.set("code", quiz.code);
      setSearchParams(params);
    }
    if (quiz) {
      console.log(quiz);
      if (quiz.error) {
        setTitle("Такого тесту не знайдено");
        setIsShowBtn(true);
      } else {
        const mode_ = quiz.questions[numQuestion - 1].mode;

        if (mode_ === "multiply") {
          setIsMultiple(true);
        } else {
          setIsMultiple(false);
        }
        setTitle(quiz.questions[numQuestion - 1].title);
        setVariants(quiz.questions[numQuestion - 1].variants);
        setQuizLenght(quiz.questions.length);
      }
    }
  };
  useEffect(() => {
    if (answers.length === 0) {
      setDisabled(true);
      setMultipleAnswersCorrect(0);
    }

    if (answers.toString() !== [].toString()) {
      setDisabled(false);
      let allCorrect = quiz.questions[numQuestion - 1].variants.filter(
        (v) => v.isCorrect
      );

      let b = 0;
      answers.forEach((answer) => {
        if (allCorrect.includes(answer)) {
          b++;
          setMultipleAnswersCorrect(b);
        }
      });
    }
  }, [answers]);

  const changeCheckBox = (e, el) => {
    if (e.target.checked) {
      setAnswers((prev) => [...prev, el]);
    } else if (!e.target.checked) {
      setAnswers((prev) => prev.filter((v) => v.value !== el.value));
    }
  };

  let [bgColors, setBgColors] = useState([]);
  useEffect(() => {
    if (variants.length) {
      setBgColors(variants.map(() => getRandomColor()));
    }
  }, [variants]);
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 156 + 50);
    const g = Math.floor(Math.random() * 156 + 50);
    const b = Math.floor(Math.random() * 156 + 50);
    return `rgba(${r}, ${g}, ${b}, 0.4)`;
  };

  const navigate = useNavigate();
  const handleClick = (e, el) => {
    quiz.questions[numQuestion - 1].variants.filter((v) => {
      if (v.value === el.value) {
        el.choice = true;
        return el;
      }
    });
    console.log(quiz);
    let nextCorrect = 0;
    if (isMultiple) {
      e.target.children[1].children[0].checked =
        !e.target.children[1].children[0].checked;

      if (e.target.children[1].children[0].checked) {
        setAnswers((prev) => [...prev, el]);
      } else if (!e.target.checked) {
        setAnswers((prev) => prev.filter((v) => v.value !== el.value));
      }
    } else {
      if (el.isCorrect) {
        nextCorrect = 1;
        setCorrectAnswers((prev) => prev + 1);
      }
      if (quiz_length === numQuestion) {
        localStorage.setItem("quiz-for-result", JSON.stringify(quiz));
        goToResult(correctAnswers + nextCorrect);
      } else {
        setNumQuestion((prev) => prev + 1);
      }
    }
  };

  const saveMultiple = (e) => {
    setAnswers([]);
    setDisabled(true);
    if (answers.length > 0) {
      let allCorrect = quiz.questions[numQuestion - 1].variants.filter(
        (v) => v.isCorrect
      );
      let valueOneAnswer = +(1 / allCorrect.length).toFixed(2);
      let correctAnswer = multipleAnswersCorrect;
      let nextCorrect = correctAnswer * valueOneAnswer;
      setCorrectAnswers((prev) => prev + nextCorrect);

      if (quiz_length === numQuestion) {
        localStorage.setItem("quiz-for-result", JSON.stringify(quiz));
        goToResult(correctAnswers + nextCorrect);
      } else {
        setNumQuestion((prev) => prev + 1);
      }
    }
  };
  const goToResult = (correctAnswers) => {
    setIsShowResult((prev) => !prev);
    localStorage.setItem(
      "result",
      JSON.stringify([quiz_length, correctAnswers])
    );
    localStorage.removeItem("code-for-start");
    navigate("/result");
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
            {!isShowResult && (
              <p>
                {numQuestion}/{quiz_length}
              </p>
            )}
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
      {!isShowResult && (
        <div className={styles.container}>
          <div className={styles.title_div}>
            <p>{title}</p>
          </div>

          <div className={styles.variants}>
            {isShowBtn && (
              <NavLink to="/" className={styles.backBtn}>
                Повернутись на головний екран{" "}
              </NavLink>
            )}
            {variants.map((el, index) => {
              return (
                <div
                  onClick={(e) => handleClick(e, el)}
                  key={el.value}
                  className={styles.variant}
                  style={{
                    backgroundColor: bgColors[index],
                  }}
                >
                  <p>{el.value}</p>
                  {isMultiple && (
                    <div className={checkbox.checkboxWrapper}>
                      <input
                        type="checkbox"
                        onChange={(e) => changeCheckBox(e, el)}
                        id={el.value}
                        className={styles.input}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isMultiple && (
            <div className={styles.containerBtnSave}>
              <button
                className={`${styles.btn_save}`}
                onClick={saveMultiple}
                disabled={isDisabled}
              >
                Зберегти
              </button>
            </div>
          )}
          {isShowLoader && (
            <div className={styles.center_loader}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      )}
      {isShowResult && (
        <Result length={quiz_length} correctAnswers={correctAnswers} />
      )}
    </div>
  );
};
