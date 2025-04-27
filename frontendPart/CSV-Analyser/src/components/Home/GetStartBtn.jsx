import React from 'react';
import styles from "./Home.module.scss";
import { useNavigate } from 'react-router-dom';

const GetStartButton = () => {
    const navigate  = useNavigate();

    const handleBtn = ()=>{
        navigate("/dashboard");
    }

  return (
    <div className={styles.wrapper}>
      <button onClick={handleBtn} className={styles.button}>
        <span className={styles.shadow} />
        <span className={styles.edge} />
        <span className={styles.front}>Get Started</span>
      </button>
    </div>
  );
};

export default GetStartButton;