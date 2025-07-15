import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./css/Layout.module.css";
import style from "./css/Header.module.css";

function ModalError({ textError }) {
  return (
    <div className={styles.errorModal}>
      <p>{textError}</p>
    </div>
  );
}

export const Layout = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const [searchNotDefined, setSearchNotDefined] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [isStartForCode, setIsStartForCode] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [textError, setTextError] = useState("");
  const [newTests, setNewTests] = useState([]);
  const [tests, setTests] = useState([]);
  console.log('rerender')
  const urlA = `test?code=`;

  useEffect(() => {
    setIsShowLoader(true);

    const fetchTests = async () => {
      try {
        let response = await fetch("https://quiz-server-kkjt.onrender.com/all");
        let data = await response.json();

        setTests(data);
        setNewTests(data.slice(0, 4));
        setIsRender(true);
        setIsShowLoader(false);

        sessionStorage.setItem("isFetchSearch", true);
        sessionStorage.setItem("fetchSearch", JSON.stringify(data));
        if (localStorage.getItem("form_status") === "startCode") {
          setTimeout(() => {
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
          setIsStartForCode((prev) => !prev);
        }
      } catch (err) {
        console.error("Помилка при завантаженні:", err);
      }
    };
    fetchTests();
  }, []);

  const changeSearch = (e) => {
    setValueSearch(e.target.value);

    if (e.target.value === "") {
      setSearchNotDefined(false);
      let tests = JSON.parse(sessionStorage.getItem("fetchSearch")).slice(0, 4);
      setNewTests(tests);
    } else {
      let search_result = tests.filter((quiz) =>
        quiz.title
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(e.target.value.replace(/\s/g, "").toLowerCase())
      );

      if (search_result.toString() === [].toString()) {
        setSearchNotDefined(true);
      } else {
        setSearchNotDefined(false);
      }
      setNewTests(search_result);
    }
  };
  const changeNickname = (e) => {
    setNickname(e.target.value);
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };
  const changeCode = (e) => {
    setCode(e.target.value);
  };
  const navigate = useNavigate();
  const createTest = () => {
    if (title === "" || nickname === "") {
      setTextError("Заповніть всі поля");
      setIsShowError(true);
      setTimeout(() => {
        setIsShowError(false);
      }, 1000);
    } else {
      localStorage.setItem("title", title);
      localStorage.setItem("author", nickname);
      navigate("/create-test");
    }
  };

  const startForCode = (e) => {
    e.preventDefault();
    if (isStartForCode) {
      e.target.textContent = "Почати за кодом";
    } else {
      e.target.textContent = "Створити тест";
    }

    if (visibility) {
      changeVisibility();
      setTimeout(() => {
        targetRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      setIsStartForCode((prev) => !prev);
      return;
    }
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsStartForCode((prev) => !prev);
  };

  let fetchCodes = async (urlGet) => {
    setIsShowLoader(true);
    let response = await fetch(urlGet);
    let data = await response.json();
    return data;
  };

  const catchErrors = async (e) => {
    try {
      if (code === "" || code.length < 6) {
        setTextError("Такого коду не існує");
        setIsShowError(true);
        setTimeout(() => {
          setIsShowError(false);
        }, 1000);
        setIsDisabled(false);
        return false;
      }
      setIsShowLoader(true);
      let codes = await fetchCodes(
        "https://quiz-server-kkjt.onrender.com/codes"
      );

      if (codes.includes(code)) {
        setIsDisabled(false);
        setIsShowLoader(false);
        return true;
      } else {
        setIsDisabled(false);
        setTextError("Такого коду не існує");
        setIsShowError(true);
        setTimeout(() => {
          setIsShowError(false);
        }, 1000);
        setIsShowLoader((prev) => !prev);
        return false;
      }
    } catch (error) {
      e.target.disabled = false;
      setTextError(error);
      setIsShowError(true);
      setTimeout(() => {
        setIsShowError(false);
      }, 1000);
      return false;
    }
  };
  const startTest = async (e) => {
    const isValid = await catchErrors(e);
    if (!isValid) return;
    navigate(`/test?code=${code}`);

    localStorage.setItem("code-for-start", code);
  };

  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    window.scrollTo(0, 0);
    setVisibility((prev) => !prev);
  };
  const targetRef = useRef();

  sessionStorage.setItem("page-loaded", false);

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
            <h1 className={style.title}>Quiz App</h1>
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
              <NavLink onClick={startForCode}>
                {!isStartForCode ? "Почати за кодом" : "Створити тест"}
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
        <div className={styles.search}>
          <input
            type="text"
            value={valueSearch}
            onChange={changeSearch}
            className={styles.inputSearch}
            placeholder="Пошук"
          />
          <div className={styles.results}>
            {searchNotDefined && (
              <h1 className={styles.searchNot}>
                За вашим запитом нічого не знайдено
              </h1>
            )}
            <div className={styles.result}>
              {isRender &&
                newTests.map((el) => {
                  return (
                    <div key={el.code} className={styles.block_result}>
                      <p>Назва:{el.title}</p>
                      <p>Автор:{el.author}</p>
                      <p>Код:{el.code}</p>
                      <a
                        href={`${window.location.origin}/quiz-app/${urlA}${el.code}`}
                        id={el.code}
                      >
                        Пройти тест
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className={styles.createTest} ref={targetRef}>
          <div className={styles.h1}>
            <h1>
              {!isStartForCode ? "Створити тест" : "Почати тест за кодом"}
            </h1>
          </div>

          <div className={styles.form}>
            <input
              type="text"
              placeholder={
                !isStartForCode ? "Введіть ваш нікнейм" : "Введіть код"
              }
              maxLength={!isStartForCode ? 100 : 6}
              value={!isStartForCode ? nickname : code}
              onChange={!isStartForCode ? changeNickname : changeCode}
            />
            {!isStartForCode && (
              <input
                type="text"
                placeholder="Введіть назву тесту"
                value={title}
                onChange={changeTitle}
              />
            )}
            <button
              className={styles.btn_create}
              onClick={!isStartForCode ? createTest : startTest}
              disabled={!isStartForCode ? false : isDisabled}
            >
              {!isStartForCode ? "Створити" : "Почати"}
            </button>
          </div>
        </div>
      </div>
      {isShowLoader && (
        <div className={styles.center_loader}>
          <div className={styles.loader}></div>
        </div>
      )}
      {isShowError && (
        <div className={styles.error}>
          <ModalError textError={textError}></ModalError>
        </div>
      )}
    </div>
  );
};
