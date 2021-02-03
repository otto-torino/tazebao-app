import React from 'react'
import Log8 from '../../Assets/img/log8_rosso.png'

import styles from './Footer.module.scss'

const Footer = props => {
  return (
    <footer className={styles.footer}>
      <div className={styles.text}>
        Tazebao © 2016-2021
        <a href='https://www.otto.to.it' target='_blank' rel='noopener noreferrer'>
          <img src={Log8} className={styles.logo} alt='Otto Srl' />
        </a>
      </div>
    </footer>
  )
}

export default Footer
