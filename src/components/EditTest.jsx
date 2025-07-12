import styles from "./css/CreateQuiz.module.css";
import style from "./css/Header.module.css";
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
  mode,
}) {
  const onEdit = (e) => {
    setIsShowModal((prev) => !prev);
    setIsEdit(true);
    setId(e.target.id);
    setQuestionEdit({
      numberQuestion: number,
      title,
      mode,
      variants: variants,
    });
  };

  return (
    <li className={styles.question_li}>
      {title}
      <div>
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          id={number}
          className={styles.newQuestion}
          onClick={onDelete}
        />
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/edit.svg"
          id={number}
          className={styles.newQuestion}
          onClick={onEdit}
        />
      </div>
    </li>
  );
}
function ModalError({ textError }) {
  return (
    <div className={styles.modal2}>
      <p>{textError}</p>
    </div>
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
            mode: question.mode,
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

  const [isShowModalError, setIsShowModalError] = useState(false);
  const [textError, setTextError] = useState("");

  const saveQuiz = async () => {
    setIsShowLoader(true);
    let newQuiz = JSON.parse(
      localStorage.getItem(`quiz-${localStorage.getItem("edit-quiz")}`)
    );
    console.log(newQuiz);
    const res = await fetch(
      `https://quiz-server-kkjt.onrender.com/get/${code}`
    );
    const oldQuiz = await res.json();

    const isEqual = JSON.stringify(newQuiz) === JSON.stringify(oldQuiz);

    if (isEqual) {
      setTextError("❌ Нічого не змінилось");
      setIsShowModalError(true);
      setTimeout(() => {
        setIsShowModalError(false);
      }, 1000);
      setIsShowLoader(false);
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
    setIsShowLoader(false);
    localStorage.setItem("quizes", JSON.stringify(updatedQuizes));
    localStorage.setItem("code-for-info", quiz.code);
    localStorage.removeItem("author");
    localStorage.removeItem("title");
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);

    navigate("/done-test");
  };
  const deleteQuiz = () => {
    localStorage.removeItem("author");
    localStorage.removeItem("title");
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);
    localStorage.removeItem(`code-create`);
    navigate("/your-tests");
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
      <div className={styles.main}>
        {isShowModalError && <ModalError textError={textError} />}
        {!isShowModal && (
          <div className={style.containerList}>
            <div className={styles.btnsT}>
              <a className={styles.save} onClick={saveQuiz}>
                Зберегти
              </a>
              <a className={styles.back} onClick={deleteQuiz}>
                Назад
              </a>
            </div>
            <div className={styles.list}>
              <ul className={styles.questions2}>
                {questions.map((question) => {
                  return (
                    <Question
                      number={question.numberQuestion}
                      key={question.numberQuestion}
                      title={question.title}
                      variants={question.variants}
                      mode={question.mode}
                      onEdit={onEdit}
                      setIsEdit={setIsEdit}
                      setIsShowModal={setIsShowModal}
                      setQuestionEdit={setQuestionEdit}
                      setId={setId}
                      onDelete={onDelete}
                    />
                  );
                })}
                <div className={styles.add_question} onClick={addQuestion}>
                  <img
                    src="https://quiz-server-kkjt.onrender.com/icons/add.svg"
                    alt=""
                    className={styles.newQuestion}
                  />
                  Додати запитання
                </div>
              </ul>
            </div>
          </div>
        )}

        {isShowLoader && (
          <div className={styles.center_loader}>
            <div className={styles.loader}></div>
          </div>
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
