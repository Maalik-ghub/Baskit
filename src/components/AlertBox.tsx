import React from "react";
import styles from './css/AlertBox.module.css';

interface AlertBoxProps {
    titleMessage: string;
    descriptionMessage: string;
    closeMessage: string;
    setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertBox: React.FC<AlertBoxProps> = ({titleMessage, descriptionMessage, closeMessage, setIsAlertOpen}) => {
    return(
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <p className={styles.title}>{titleMessage}</p>
                <p className={styles.description}>{descriptionMessage}</p>
                <button className={styles.close} onClick={() => setIsAlertOpen(false)}>{closeMessage}</button>
            </div>
        </div>
    )
}

export default AlertBox;