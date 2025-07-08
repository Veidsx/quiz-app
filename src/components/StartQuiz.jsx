import style from "./css/StartQuiz.module.css";
import { useState, useEffect } from "react";
import { Result } from "./Result";
import { useNavigate } from "react-router";

export const StartQuiz = () => {
  let code = localStorage.getItem("code-for-start");
  let [title, setTitle] = useState("");
  let [variants, setVariants] = useState([]);
  let [quiz_length, setQuizLenght] = useState(0);
  let [numQuestion, setNumQuestion] = useState(1);
  let [isShowResult, setIsShowResult] = useState(false);
  let [correctAnswers, setCorrectAnswers] = useState(0);
  useEffect(() => {
    const url = `https://quiz-server-kkjt.onrender.com/get/${code}`;
     const fetchQuiz = async(url) => {
      let response = await fetch(url);
      let data = await response.json();
      let quiz = data;
      changeQuestion(quiz);
    }
    fetchQuiz(url);
  }, [numQuestion]);

  let changeQuestion = (quiz) => {
    setTitle(quiz.questions[numQuestion - 1].title);
    setVariants(quiz.questions[numQuestion - 1].variants);
    setQuizLenght(quiz.questions.length)
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
      navigate("/result");
    } else {
      setNumQuestion((prev) => prev + 1);
    }
  };
  return (
    <div>
      <header className={style.header}>
        <h1 className={style.title}>Quiz App</h1>
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
        </div>
      )}
      {isShowResult && (
        <Result length={quiz_length} correctAnswers={correctAnswers} />
      )}
    </div>
  );
};
