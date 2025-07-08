import style from "./css/CreateQuiz.module.css";
import { useEffect, useState } from "react";

function Variant({ index, value, fDel, onChange, isCorrect, changeCorrect }) {
  return (
    <li>
      <input
        type="text"
        placeholder={`Варіант ${index + 1}`}
        id={index}
        className={style.variant}
        onChange={(e) => onChange(index, e.target.value)}
        value={value}
      />
      <label>
        <input
          type="checkbox"
          checked={isCorrect}
          onChange={(e) => changeCorrect(index, e.target.checked)}
        />
      </label>
      {index >= 2 && (
        <img
          src="https://quiz-server-kkjt.onrender.com/icons/delete.svg"
          alt={"delete"}
          className={style.del_variant}
          onClick={() => fDel(index)}
        />
      )}
    </li>
  );
}

function ModalError({ textError }) {
  return (
    <div className={style.modal2}>
      <p>{textError}</p>
    </div>
  );
}
export const Modal = ({
  onClose,
  onChangeQuestions,
  numberQuestion,
  editQuestion,
  plusNumberQuestion,
  numberAlt
}) => {
  let [variants, updateVariants] = useState([
    { value: "", isCorrect: false },
    { value: "", isCorrect: false },
  ]);
  let [heigth, setHeigth] = useState(600);

  const addVariant = () => {
    updateVariants((prev) => [...prev, { value: "", isCorrect: false }]);
    setHeigth((prev) => prev + 40);
  };

  const updateVariant = (index, newValue) => {
    updateVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, value: newValue } : v))
    );
  };
  const del_variant = (indexToDelete) => {
    updateVariants((prev) => prev.filter((_, i) => i !== indexToDelete));
    setHeigth((prev) => prev - 40);
  };

  const changeCorrect = (index) => {
    updateVariants((prev) =>
      prev.map((v, i) => ({ ...v, isCorrect: i === index }))
    );
  };
  const [isEditQuestion, setIsEditQuestion] = useState(false);

  useEffect(() => {
    if (editQuestion) {
      setValueTextArea(editQuestion.title);
      updateVariants(editQuestion.variants);     
      setIsEditQuestion(true);
    }
  }, [editQuestion]);

  const [value_textarea, setValueTextArea] = useState("");
  const [isShowModalError, setIsShowModalError] = useState(false);
  const [textError, setTextError] = useState("");

  const onChangeTextArea = (e) => {
    setValueTextArea(e.target.value);
  };
  const catchErrors = () => {
    if (value_textarea.trim() === "") {
      setTextError("Заповніть поле запитання");
      showError();
      return false;
    }

    const hasEmpty = variants.some((v) => v.value.trim() === "");
    if (hasEmpty) {
      setTextError("Заповніть усі варіанти відповіді");
      showError();
      return false;
    }

    const hasCorrect = variants.some((v) => v.isCorrect);
    if (!hasCorrect) {
      setTextError("Виберіть 1 правильну відповідь");
      showError();
      return false;
    }
    
    return true;
  };

  const showError = () => {
    setIsShowModalError(true);
    setTimeout(() => setIsShowModalError(false), 1000);
  };
  const updateQuestion = () => {
    if (!catchErrors()) return;
    
    const question = {
      numberQuestion,
      title: value_textarea,
      variants: variants,
    };
    onChangeQuestions(question, true);
    onClose();
  };
  const createQuestion = () => {
    if (!catchErrors()) return;
    plusNumberQuestion()
    console.log(numberQuestion)
    const question = {
      numberQuestion,
      title: value_textarea,
      variants: variants,
    };
    onChangeQuestions(question, false);
    onClose();
  };
  return (
    <div className={style.modal} style={{ height: `${heigth}` }}>
      <div className={style.container}>
        {isShowModalError && <ModalError textError={textError} />}
      </div>
      <h1>Додати запитання</h1>
      <p>Запитання (обов'язкове поле) </p>
      <textarea
        className={style.textarea}
        placeholder="Ваше запитання"
        onChange={onChangeTextArea}
        value={value_textarea}
      ></textarea>
      <p>Вкажіть варіанти відповідей</p>

      <ul className={style.questions}>
        {variants.map((variant, index) => {
          return (
            <Variant
              key={index}
              index={index}
              fDel={del_variant}
              value={variant.value}
              isCorrect={variant.isCorrect}
              onChange={updateVariant}
              changeCorrect={changeCorrect}
            />
          );
        })}
      </ul>

      <button onClick={addVariant}>Додати варіант відповіді</button>
      <div className={style.btns}>
        <button onClick={onClose}>Назад</button>
        {isEditQuestion ? (
          <button onClick={updateQuestion}>Оновити запитання</button>
        ) : (
          <button onClick={createQuestion}>Створити запитання</button>
        )}
      </div>
    </div>
  );
};
