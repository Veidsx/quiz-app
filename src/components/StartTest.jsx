import style from "./css/StartQuiz.module.css";
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

  useEffect(() => {
    setIsShowLoader(true);
    const fetchQuiz = async (url) => {
      let response = await fetch(url).catch((error) => {
        setIsShowLoader(false);
      });
      let data = await response.json().catch((error) => {
        setIsShowLoader(false);
      });
      setQuiz(data);
      localStorage.setItem('title', data.title)
      localStorage.setItem('author', data.author)
      changeQuestion(quiz);
      setIsShowLoader(false);
    };
    let url = "";
    if (searchParams.has("code")) {
      url = `https://quiz-server-kkjt.onrender.com/get/${searchParams.get(
        "code"
      )}`;
    } else {
      url = `https://quiz-server-kkjt.onrender.com/get/${code}`;
    }

    fetchQuiz(url);
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
      console.log(quiz)
      setTitle(quiz.questions[numQuestion - 1].title);
      setVariants(quiz.questions[numQuestion - 1].variants);
      setQuizLenght(quiz.questions.length);
    }
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 156 + 50);
    const g = Math.floor(Math.random() * 156 + 50);
    const b = Math.floor(Math.random() * 156 + 50);
    return `rgba(${r}, ${g}, ${b}, 0.4)`;
  };

  const navigate = useNavigate();
  const handleClick = (value) => {
    let nextCorrect = correctAnswers;

    if (value.isCorrect) {
      nextCorrect = correctAnswers + 1;
      setCorrectAnswers(nextCorrect);
    }
    if (quiz_length === numQuestion) {
      setIsShowResult((prev) => !prev);
      localStorage.setItem(
        "result",
        JSON.stringify([quiz_length, nextCorrect])
      );
      localStorage.removeItem("code-for-start");
      navigate("/result");
    } else {
      setNumQuestion((prev) => prev + 1);
    }
  };
  return (
    <div>
      <header className={style.header}>
        <NavLink to='/' className={style.title}>Quiz App</NavLink>
        {!isShowResult && (
          <p>
            {numQuestion}/{quiz_length}
          </p>
        )}
      </header>
      {!isShowResult && (
        <div className={style.container}>
          <div className={style.title_div}>
            <p>{title}</p>
          </div>
          <div className={style.variants}>
            {variants.map((el) => {
              return (
                <div
                  onClick={() => handleClick(el)}
                  key={el.value}
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {el.value}
                </div>
              );
            })}
          </div>
          {isShowLoader && (
            <div className={style.center_loader}>
              <div className={style.loader}></div>
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
