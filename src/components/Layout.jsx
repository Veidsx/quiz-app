import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./css/Layout.module.css";
import { Modal } from "./Modal";

export const Layout = () => {
  const [isShowModal, setIsShowModal] = useState(false);

  const fModal = () => {
    setIsShowModal((isShow) => !isShow);
    
  };

  sessionStorage.setItem("page-loaded", false);
  const createNewQuiz = () => {};

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Quiz App</h1>
      </header>
      <main>
        {!isShowModal && (
          <NavLink className={styles.btn_start} onClick={fModal}>
            Почати тест за кодом
          </NavLink>
        )}
        {!isShowModal && (
          <NavLink
            to="/create-quiz"
            className={styles.btn_create}
            onClick={createNewQuiz}
          >
            Створити новий тест
          </NavLink>
        )}
        {isShowModal && <Modal onClose={() => setIsShowModal(false)} />}
      </main>
    </div>
  );
};
