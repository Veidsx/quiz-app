import style from "./css/CreateQuiz.module.css";
import { Modal } from "./CreateQuestionMenu";
import { useSearchParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Question({
  number,
  title,
  variants,
  setIsShowModal,
  setIsEdit,
  setQuestionEdit,
  setNumberAlt,
  onDelete,
}) {

  const onEdit = (e) => {
    setIsShowModal((prev) => !prev);
    setIsEdit(true);
    setQuestionEdit({ numberQuestion: number, title, variants: variants });
    setNumberAlt(e.target.alt);
  };

  return (
    <li className={style.question_li}>
      Запитання {number}
      <div>
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          alt={number}
          className={style.newQuestion}
          onClick={onDelete}
        />
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/edit.svg"
          alt={number}
          className={style.newQuestion}
          onClick={onEdit}
        />
      </div>
    </li>
  );
}

export const CreateQuiz = () => {
  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  let [questions, setQuestions] = useState([]);
  let [numberQuestion, setNumberQuestion] = useState(1);
  let [numberAlt, setNumberAlt] = useState(0);
  let onDelete = (e) => {
    const deleteNumber = +e.target.alt;

    setQuestions((prevQuestions) => {
      let newQuestions = prevQuestions
        .filter((q) => q.numberQuestion !== deleteNumber)
        .map((el) => {
          return el.numberQuestion > deleteNumber
            ? { ...el, numberQuestion: el.numberQuestion - 1 }
            : el;
        });
      const quiz = {
        code: localStorage.getItem("code-create"),
        questions: newQuestions,
      };
      localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz));
      return newQuestions;
    });
  };

  let onChangeQuestions = (question, isEditQuestion) => {
    if (isEditQuestion) {
      setQuestions((prevQuestions) => {
        const variants = question.variants;
        const nextQuestions = [];
        const previousQuestions = [];
        prevQuestions.forEach((element) => {
          if (element.numberQuestion > numberAlt) {
            nextQuestions.push(element);
          } else if (element.numberQuestion < numberAlt) {
            previousQuestions.unshift(element);
          }
        });

        const updatedQuestion = [
          {
            numberQuestion: +numberAlt,
            title: question.title,
            variants: variants,
          },
        ];
        if (previousQuestions[0] !== null) {
          previousQuestions.forEach((el) => {
            updatedQuestion.unshift(el);
          });
        }
        if (nextQuestions[0] !== null) {
          nextQuestions.forEach((el) => {
            updatedQuestion.push(el);
          });
        }

        const quiz = {
          code: localStorage.getItem("code-create"),
          questions: updatedQuestion,
        };

        localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz));
        setIsEdit(false);
        return quiz.questions;
      });
    } else {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, question];

        const quiz = {
          code: localStorage.getItem("code-create"),
          questions: updatedQuestions,
        };
        localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz));
        return updatedQuestions;
      });
    }
  };
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
        const newCode = generateCode();
        localStorage.setItem("code-create", newCode);
        params.set("code", newCode);
        sessionStorage.setItem("page-loaded", true);
      }

      setSearchParams(params);
    }
    setUrl();
  }, []);
  useEffect(() => {
    let saved = localStorage.getItem(
      `quiz-${localStorage.getItem("code-create")}`
    );
    if (saved) {
      if (localStorage.getItem("code-create") === JSON.parse(saved).code) {
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
  const [questionEdit, setQuestionEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const onEdit = (question) => {
    console.log(question);
  };
  const addQuestion = () => {
    setIsShowModal((isShow) => !isShow);
  };
  const url = "https://quiz-server-kkjt.onrender.com/save";
  
  const saveQuiz = () => {

    let quiz = JSON.parse(localStorage.getItem(`quiz-${localStorage.getItem("code-create")}`))
    if (quiz) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(quiz), 
      });
    }
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`)
  };
  const deleteQuiz = () => {
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);
    localStorage.removeItem(`code-create`);
  };
  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>Quiz App</h1>
      </header>
      <div className={style.main}>
        <div className="c">
          <NavLink to="/" className={style.save} onClick={saveQuiz}>
            Зберегти
          </NavLink>
          <NavLink to="/" className={style.back} onClick={deleteQuiz}>
            Назад
          </NavLink>
        </div>
        <ul>
          {questions.map((question) => {
            return (
              <Question
                number={question.numberQuestion}
                key={question.numberQuestion}
                title={question.title}
                variants={question.variants}
                onEdit={onEdit}
                setIsEdit={setIsEdit}
                setIsShowModal={setIsShowModal}
                setQuestionEdit={setQuestionEdit}
                setNumberAlt={setNumberAlt}
                onDelete={onDelete}
              />
            );
          })}
          <div className={style.add_question} onClick={addQuestion}>
            <img
              src="https://quiz-server-kkjt.onrender.com/icons/add.svg"
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
              editQuestion={isEdit && questionEdit}
              plusNumberQuestion={() => setNumberQuestion((prev) => prev + 1)}
              numberAlt={numberAlt}
            />
          )}
        </ul>
      </div>
    </div>
  );
};
