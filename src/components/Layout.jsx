import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./css/Layout.module.css";
import { Modal } from "./Modal";
import { EnterName } from "./EnterName";

export const Layout = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowEnter, setIsShowEnter] = useState(false);

  const fModal = () => {
    setIsShowModal((isShow) => !isShow);
  };
  const enterName = () => {
    setIsShowEnter((isShow) => !isShow);
  };

  sessionStorage.setItem("page-loaded", false);

  return (
    <div className={styles.bg}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quiz App</h1>
      </header>
      <main>
        {!(isShowModal || isShowEnter) && (
          <NavLink className={styles.btn_start} onClick={fModal}>
            Почати тест за кодом
          </NavLink>
        )}
        {!(isShowModal || isShowEnter) && (
          <NavLink className={styles.btn_create} onClick={enterName}>
            Створити новий тест
          </NavLink>
        )}
        {!(isShowModal || isShowEnter) && (
          <NavLink className={styles.btn_create} to='/your-tests'>
            Ваші тести
          </NavLink>
        )}
        {isShowModal && <Modal onClose={() => setIsShowModal(false)} />}
        {isShowEnter && <EnterName onClose={() => setIsShowEnter(false)} />}
      </main>
    </div>
  );
};
