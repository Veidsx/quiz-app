import styles from "./css/EnterName.module.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModalError({ textError }) {
	return (
		<div className={styles.modal2}>
			<p>{textError}</p>
		</div>
	);
}

export const EnterName = ({onClose}) => {
	const [value, setValue] = useState("");
	const [isChangePlaceholder, setIsChangePlace] = useState(false)
	const [isShowError, setIsShowError] = useState(false);
	const [textError, setTextError] = useState("");
	const navigate = useNavigate()
  const changeInput = (e) => {
    setValue(e.target.value);
  };
	const setName = () => {
		if(value === ''){
			setTextError('Введіть щось')
			setIsShowError(true)
			setTimeout(() => {
				setIsShowError(false)
			}, 1000);
		} else if(!isChangePlaceholder) {
			localStorage.setItem('author', value)
			setValue('')
			setIsChangePlace(true)
		} else {
			localStorage.setItem('title', value)
			navigate('/create-test')
		}
	}
  return (
    <div className={styles.modal}>
      <input
			placeholder={isChangePlaceholder ? 'Введіть назву тесту' : 'Введіть ваш нікнейм'}
        type="text"
        className={styles.input}
        onChange={changeInput}
        value={value}
      />
      <button className={styles.btn_back} onClick={setName}>
        Підтвердити
      </button>
      <button className={styles.btn_back} onClick={onClose}>
        Назад
      </button>
			{isShowError && <ModalError textError={textError}></ModalError>}
    </div>
  );
};
