import style from "./css/CreateQuiz.module.css";
import { Modal } from "./CreateQuestionMenu";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Question({ number }) {
  return (
    <li className={style.question_li}>
      Запитання {number}
      <div>
        <img
          src="/img/x-circle-svgrepo-com(1).svg"
          alt=""
          className={style.newQuestion}
        />
        <img
          src="/img/edit-svgrepo-com(3).svg"
          alt=""
          className={style.newQuestion}
        />
      </div>
    </li>
  );
}

export const CreateQuiz = ({ isUpdateUrl }) => {
  location.reload
  let result = "";
  function generateCode() {
    for (let i = 0; i <= 6; i++) {
      let a = Math.random().toFixed(1) * 10;
      a !== 10 ? (result += a) : result;
    }
  }

  let [questions, setQuestions] = useState([]);

  let [numberQuestion, setNumberQuestion] = useState(0);
  let onChangeQuestions = (question) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, question];

      const quiz = {
        code: localStorage.getItem("code-create"),
        questions: updatedQuestions,
      };
      localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz));
      return updatedQuestions;
    });
    setNumberQuestion((prev) => prev + 1);
  };
  useEffect(() => {
    let saved = localStorage.getItem(
      `quiz-${localStorage.getItem("code-create")}`
    );
    if(saved){
      if (localStorage.getItem('code-create') === JSON.parse(saved).code ) {
        try {
          const parsed = JSON.parse(saved);
          
          setQuestions(parsed.questions || []);
        } catch (e) {
          throw new Error(e.message);
        }
      }
    }

    window.addEventListener("beforeunload", () => {
      if (!sessionStorage.getItem("page-loaded")) {
        localStorage.removeItem("code-create");
      }
    });
  }, []);

  generateCode();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (localStorage.getItem("code-create")) {
      const params = new URLSearchParams();
      params.set("code", localStorage.getItem("code-create"));
      setSearchParams(params);
    }

    function setUrl() {
      const params = new URLSearchParams();

      if (sessionStorage.getItem("page-loaded") === "true") {
        params.set("code", localStorage.getItem("code-create"));
        sessionStorage.setItem("page-loaded", true);
      } else {
        localStorage.setItem("code-create", result);
        params.set("code", result);
        sessionStorage.setItem("page-loaded", true);
      }

      setSearchParams(params);
    }
    setUrl();
  }, []);

  const [isShowModal, setIsShowModal] = useState(false);
  const addQuestion = () => {
    setIsShowModal((isShow) => !isShow);
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>Quiz App</h1>
      </header>
      <div className={style.main}>
        <ul>
          {questions.map((question) => {
            return (
              <Question
                number={question.numberQuestion}
                key={question.numberQuestion}
              />
            );
          })}
          <div className={style.add_question} onClick={addQuestion}>
            <img
              src="/img/plus-circle-svgrepo-com(1).svg"
              alt=""
              className={style.newQuestion}
            />
            Додати запитання
          </div>
          {isShowModal && (
            <Modal
              onClose={() => setIsShowModal(false)}
              onChangeQuestions={onChangeQuestions}
              numberQuestion={numberQuestion}
            />
          )}
        </ul>
      </div>
    </div>
  );
};
