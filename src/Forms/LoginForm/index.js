import React, { useState } from 'react'

import PropTypes from "prop-types"

import styles from './LoginForm.module.scss'

const LoginForm = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className={styles.loginForm}>
      <div className={styles.logoContainer}>
        LOGO
      </div>
      <div className={styles.form}>
        {props.error && (
          <div>
            warning
            <p>
              {props.errorMessage}
            </p>
          </div>
        )}
        <div>
          <input placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <input placeholder='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => props.onSubmit(username, password)}>login</button>
        </div>
        <p className={styles.discalimer}>Vivamus euismod mauris. Fusce neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas nec odio et ante tincidunt tempus. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi.</p>
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string
}

export default LoginForm
