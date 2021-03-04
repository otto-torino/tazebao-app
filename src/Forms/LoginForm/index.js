import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Logo from '../../Assets/img/logo.png'
import { Form, Input, Message, Icon, Image, Button } from 'semantic-ui-react'

import styles from './LoginForm.module.scss'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className={styles.loginForm}>
      <div className={styles.logoContainer}>
        <Image src={Logo} alt='logo' centered />
      </div>
      <Form className={styles.form}>
        {props.error && (
          <Message size='mini' negative icon>
            <Icon name='warning' />
            <Message.Content>{props.errorMessage}</Message.Content>
          </Message>
        )}
        <Form.Field>
          <Input placeholder='username' fluid value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <Input
            placeholder='password'
            type='password'
            fluid
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <div style={{ textAlign: 'center' }}>
          <Button color='red' onClick={() => props.onSubmit(username, password)} style={{ textTransform: 'uppercase' }}>
            Login
          </Button>
        </div>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string
}

export default LoginForm
