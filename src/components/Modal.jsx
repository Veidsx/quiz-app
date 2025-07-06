import styles from "./css/Modal.module.css";
import {useState} from 'react'

export const Modal = ({onClose}) => {
	const [value, setValue] = useState('')
	const [isDisabled, setIsDisabled] = useState(false)

	const changeInput = (e) => {
		setValue(e.target.value.replace(/[^0-9]/g, ''))
		if(value.length > 6){
			setIsDisabled(true)
		}
	}
	const startHandler = () => {
		console.log(value)
	}
  return (
		<div className={styles.modal}>
			<input type="text" pattern="[0-9]*" className={styles.input} onChange={changeInput} value={value} maxLength={6}/>
			<button className={styles.btn_start} onClick={startHandler}>Почати</button>
			<button className={styles.btn_back} onClick={onClose}>Назад</button>
		</div>
	)
};
