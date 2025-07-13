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
  setId,
  onDelete,
  mode,
}) {
  const onEdit = (e) => {
    setIsShowModal((prev) => !prev);
    setIsEdit(true);
    setQuestionEdit({
      numberQuestion: number,
      title,
      mode,
      variants: variants,
    });
    setId(e.target.id);
  };

  return (
    <li className={styles.question_li}>
      {title}
      <div>
        <img
          id={number}
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          alt={number}
          className={styles.newQuestion}
          onClick={onDelete}
        />
        <img
          id={number}
          src="https://quiz-server-kkjt.onrender.com/icons/edit.svg"
          alt={number}
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

export const CreateTest = () => {
  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  let [questions, setQuestions] = useState([]);
  let [numberQuestion, setNumberQuestion] = useState(1);
  let [id, setId] = useState(0);

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
        author: localStorage.getItem("author"),
        title: localStorage.getItem("title"),
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
          if (element.numberQuestion > id) {
            nextQuestions.push(element);
          } else if (element.numberQuestion < id) {
            previousQuestions.unshift(element);
          }
        });
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

        const quiz = {
          code: localStorage.getItem("code-create"),
          author: localStorage.getItem("author"),
          title: localStorage.getItem("title"),
          questions: updatedQuestion,
        };

        localStorage.setItem(`quiz-${quiz.code}`, JSON.stringify(quiz));
        setIsEdit(false);
        return quiz.questions;
      });
    } else {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, question];
        console.log(updatedQuestions);
        const quiz = {
          code: localStorage.getItem("code-create"),
          author: localStorage.getItem("author"),
          title: localStorage.getItem("title"),
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
          // setNumberQuestion(questions.length)
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
  const [isShowModalError, setIsShowModalError] = useState(false);
  const [textError, setTextError] = useState("");
  let navigate = useNavigate();
  const saveQuiz = () => {
    let quiz = JSON.parse(
      localStorage.getItem(`quiz-${localStorage.getItem("code-create")}`)
    );
    if (quiz === null) {
      setTextError("Створіть хочаб 1 запитання");
      setIsShowModalError(true);
      setTimeout(() => {
        setIsShowModalError(false);
      }, 1000);
      return;
    }
    if (quiz) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });
      let quizes = JSON.parse(localStorage.getItem("quizes"));
      if (quizes) {
        localStorage.setItem("quizes", JSON.stringify([...quizes, quiz]));
      } else {
        localStorage.setItem("quizes", JSON.stringify([quiz]));
      }

      localStorage.setItem("code-for-info", quiz.code);
      localStorage.removeItem("author");
      localStorage.removeItem("title");
      navigate("/done-test");
    } else {
      localStorage.removeItem("author");
      localStorage.removeItem("title");
      navigate("/");
    }
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);
  };
  const deleteQuiz = () => {
    localStorage.removeItem("author");
    localStorage.removeItem("title");
    localStorage.removeItem(`quiz-${localStorage.getItem("code-create")}`);
    localStorage.removeItem(`code-create`);
    navigate("/");
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
      {!(isShowModal || visibility) && (
        <div className={styles.btnsT}>
          <a className={styles.save} onClick={saveQuiz}>
            Зберегти
          </a>
          <a className={styles.back} onClick={deleteQuiz}>
            Назад
          </a>
        </div>
      )}

      <div className={isShowModal ? styles.mainModal : styles.main}>
        {!isShowModal && (
          <div className={styles.list}>
            <ul className={styles.questions2}>
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
                    setId={setId}
                    onDelete={onDelete}
                    mode={question.mode}
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
        )}
        {isShowModalError && <ModalError textError={textError} />}
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
