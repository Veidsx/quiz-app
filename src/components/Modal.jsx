import styles from "./css/Modal.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ModalError({ textError }) {
  return (
    <div className={styles.modal2}>
      <p>{textError}</p>
    </div>
  );
}

export const Modal = ({ onClose }) => {
  const [value, setValue] = useState("");
  const [isShowError, setIsShowError] = useState(false);
  const [textError, setTextError] = useState("");
  const navigate = useNavigate();

  const changeInput = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(newValue);
  };
  const urlGet = "https://quiz-server-kkjt.onrender.com/codes";
  let fetchCodes = async (urlGet) => {
    let response = await fetch(urlGet);
    let data = await response.json();
    console.log(data);
    setIsShowLoader(true)
    return data;
  };
  let [isShowLoader, setIsShowLoader] = useState(false)

  const catchErrors = async (e) => {
    
    try {
      if(value === '') {
        setTextError("Такого коду не існує");
        setIsShowError(true);
        setTimeout(() => {
          setIsShowError(false);
        }, 1000);
        setIsShowLoader(false)
        return false;
    }
      let codes = await fetchCodes(urlGet);
      
     
      if (codes.includes(value)) {
        e.target.disabled = false
        setIsShowLoader(false)
        return true;
      } else {
        e.target.disabled = false
        setTextError("Такого коду не існує");
        setIsShowError(true);
        setTimeout(() => {
          setIsShowError(false);
        }, 1000);
        setIsShowLoader((prev) => !prev)
        return false;
      }
    } catch(error) {
      e.target.disabled = false
      console.error("❌ Помилка при перевірці коду:", error);
      setTextError("Помилка з'єднання із сервером");
      setIsShowError(true);
      setTimeout(() => {
        setIsShowError(false);
      }, 1000);
      return false;
    }
  };
  const startHandler = async (e) => {
    setIsShowLoader(true)
    e.target.disabled = true
    const isValid = await catchErrors(e);
    if (!isValid) return;

    navigate("/test");

    localStorage.setItem("code-for-start", value);
  };
  return (
    <div className={styles.modal}>
      <input
        type="text"
        pattern="[0-9]*"
        className={styles.input}
        onChange={changeInput}
        value={value}
        maxLength={6}
      />
      {isShowLoader &&  <div className={styles.loader}></div>}
      <button className={styles.btn_start} onClick={startHandler}>
        Почати
      </button>
      <button className={styles.btn_back} onClick={onClose}>
        Назад
      </button>
      {isShowError && <ModalError textError={textError}></ModalError>}
    </div>
  );
};
