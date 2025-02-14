import React from 'react'
import styles from './Home.module.scss'
import Card from './Card'

const Overview = () => {
  return (
    <div className={styles.Overview}>
        


            <div className={styles.OverviewBox}>
                <h1>What Is Analyse IQ?</h1>
                <div>
                    <h3>Turn Raw Data into Insights</h3>
                    <li>Upload a CSV and instantly explore trends, patterns, and relationships.</li>
                    <li>Ask questions in plain English, and let AI generate smart responses.</li>
                    <li>Visualize your data with interactive graphs and charts.</li>
                </div>
                
            </div>
            <div className={styles.OverviewBox}></div>
            <div className={styles.OverviewBox}></div>
    </div>
  )
}

export default Overview