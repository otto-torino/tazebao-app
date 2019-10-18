import React from 'react'
import LoginForm from '../../Forms/LoginForm'
import styles from "./LoginView.module.css";
import { useDispatch, useSelector } from 'react-redux'
import AuthActions from '../../Redux/Auth'

const LoginView = props => {
  const dispatch = useDispatch()
  const error = useSelector(state => state.auth.error)
  const errorMessage = useSelector(state => state.auth.errorMessage)

  return (
    <div className={styles.loginView}>
      <LoginForm
        onSubmit={(username, password) => dispatch(AuthActions.loginRequest({ username, password }))}
        {...{error, errorMessage}}
      />
    </div>
  )
}

export default LoginView
