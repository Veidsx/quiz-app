import style from "./css/CreateQuiz.module.css";
import { Modal } from "./CreateQuestionMenu";
import { useSearchParams, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Question({
  number,
  title,
  variants,
  setIsShowModal,
  setIsEdit,
  setQuestionEdit,
  onDelete,
  setId,
  setQuestions,
  code,
}) {
  const onEdit = (e) => {
    const quizLocal = JSON.parse(localStorage.getItem(`quiz-${code}`));
    console.log(quizLocal, number);
    setIsShowModal((prev) => !prev);
    setIsEdit(true);
    setId(e.target.id);
    setQuestionEdit({ numberQuestion: number, title, variants: variants });
    setQuestions(quizLocal.questions);
  };

  return (
    <li className={style.question_li}>
      {title}
      <div>
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          id={number}
          className={style.newQuestion}
          onClick={onDelete}
        />
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/edit.svg"
          id={number}
          className={style.newQuestion}
          onClick={onEdit}
        />
      </div>
    </li>
  );
}

export const EditTest = () => {
  const code = localStorage.getItem("edit-quiz");
  const [quiz, setQuiz] = useState({});
  useEffect(() => {
    const urlFetch = `https://quiz-server-kkjt.onrender.com/get/${code}`;

    const fetchQuiz = async (url) => {
      let response = await fetch(url);
      let data = await response.json();
      setQuiz(data);
      updateData(data);
    };
    fetchQuiz(urlFetch);
  }, []);

  const params = new URLSearchParams();
  params.set("code", code);
  let [questions, setQuestions] = useState([]);
  let [numberQuestion, setNumberQuestion] = useState(1);
  let [id, setId] = useState(0);

  const updateData = (quiz) => {
    const quizLocal = JSON.parse(localStorage.getItem(`quiz-${code}`));
    // console.log(quizLocal.questions.length)
    if (quizLocal) {
      setQuiz(quizLocal);
      setQuestions(quizLocal.questions);
      setNumberQuestion(quizLocal.questions.length);
    } else {
      setQuestions(quiz.questions);
      setNumberQuestion(quiz.questions.length);
    }
    setNumberQuestion((prev) => prev + 1);
  };
  let onDelete = (e) => {
    console.log(e.target.id);
    const deleteNumber = +e.target.id;

    setQuestions((prevQuestions) => {
      let newQuestions = prevQuestions
        .filter((q) => {
          console.log(deleteNumber, q.numberQuestion);
          return q.numberQuestion !== deleteNumber;
        })
        .map((el) => {
          return el.numberQuestion > deleteNumber
            ? { ...el, numberQuestion: el.numberQuestion - 1 }
            : el;
        });
      const quiz2 = {
        code: code,
        author: quiz.author,
        title: quiz.title,
        questions: newQuestions,
      };
      localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz2));
      return newQuestions;
    });
  };

  let onChangeQuestions = (question, isEditQuestion) => {
    if (isEditQuestion) {
      setQuestions((prevQuestions) => {
        const variants = question.variants;
        const nextQuestions = prevQuestions.filter(
          (el) => el.numberQuestion > id
        );
        const previousQuestions = prevQuestions.filter(
          (el) => el.numberQuestion < id
        );

        const updatedQuestion = [
          {
            numberQuestion: +id,
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

        const newQuiz = {
          code: code,
          author: quiz.author,
          title: quiz.title,
          questions: updatedQuestion,
        };

        localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(newQuiz));
        setIsEdit(false);
        return quiz.questions;
      });
    } else {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, question];

        const newQuiz = {
          code: code,
          author: quiz.author,
          title: quiz.title,
          questions: updatedQuestions,
        };
        localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(newQuiz));
        return updatedQuestions;
      });
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (localStorage.getItem("edit-quiz")) {
      const params = new URLSearchParams();
      params.set("code", localStorage.getItem("edit-quiz"));
      setSearchParams(params);
    }

    function setUrl() {
      const params = new URLSearchParams();
      params.set("code", localStorage.getItem("edit-quiz"));
      setSearchParams(params);
    }
    setUrl();
  }, []);

  const [questionEdit, setQuestionEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const onEdit = () => {};
  const addQuestion = () => {
    setIsShowModal((isShow) => !isShow);
  };
  const url = `https://quiz-server-kkjt.onrender.com/update/${code}`;

  let navigate = useNavigate();
  const [isShowLoader, setIsShowLoader] = useState(false);
  const saveQuiz = async () => {
    setIsShowLoader(true)
    let newQuiz = JSON.parse(
      localStorage.getItem(`quiz-${localStorage.getItem("edit-quiz")}`)
    );
    console.log(newQuiz);
    const res = await fetch(
      `https://quiz-server-kkjt.onrender.com/get/${code}`
    );
    const oldQuiz = await res.json();

    const isEqual = JSON.stringify(newQuiz) === JSON.stringify(oldQuiz);

    if (!isEqual) {
      console.log("❌ Нічого не змінилось");
      setIsShowLoader(false)
      navigate("/done-quiz");
      return false;
    }
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz),
    });
    
    const quizes = JSON.parse(localStorage.getItem("quizes")) || [];
    const updatedQuizes = quizes.map((q) => (q.code === code ? newQuiz : q));

    if (!updatedQuizes.find((q) => q.code === code)) {
      updatedQuizes.push(newQuiz);
    }
    setIsShowLoader(false)
    localStorage.setItem("quizes", JSON.stringify(updatedQuizes));
    localStorage.setItem("code-for-info", quiz.code);
    localStorage.removeItem("author");
    localStorage.removeItem("title");
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);

    navigate("/done-quiz");
  };
  const deleteQuiz = () => {
    localStorage.removeItem("author");
    localStorage.removeItem("title");
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);
    localStorage.removeItem(`code-create`);
    navigate("/your-tests");
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>Quiz App</h1>
      </header>
      <div className={style.main}>
        {!isShowModal && (
          <div className="c">
            <a className={style.save} onClick={saveQuiz}>
              Оновити тест
            </a>
            <a className={style.back} onClick={deleteQuiz}>
              Назад
            </a>
          </div>
        )}
        {isShowLoader && (
          <div className={style.center_loader}>
            <div className={style.loader}></div>
          </div>
        )}
        {!isShowModal && (
          <ul className={style.questions2}>
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
                  onDelete={onDelete}
                  setId={setId}
                  setQuestions={setQuestions}
                  code={code}
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
          </ul>
        )}

        {isShowModal && (
          <Modal
            onClose={() => {
              setIsShowModal(false);
              setIsEdit(false);
            }}
            onChangeQuestions={onChangeQuestions}
            numberQuestion={numberQuestion}
            editQuestion={isEdit && questionEdit}
            plusNumberQuestion={() => setNumberQuestion((prev) => prev + 1)}
            numberAlt={id}
          />
        )}
      </div>
    </div>
  );
};
