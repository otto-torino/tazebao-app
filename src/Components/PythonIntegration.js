import React from 'react'
import PropTypes from 'prop-types'
import Code from 'react-code-prettify'

const PythonIntegration = props => {
  const code = `

  import hmac
  import hashlib
  import base64
  import json
  import urllib2

  from email.utils import formatdate

  API_KEY = '${props.client.idKey}'
  SECRET_KEY = '${props.client.secretKey}'

  def encrypt(secret, bs):
      """ Generates a signature of bs using the given secret key """
      dig = hmac.new(
          secret,
          bs,
          digestmod=hashlib.sha256).digest()

      return base64.b64encode(dig).decode()


  def subscribe(email, firstname, lastname, cap):
      date = formatdate(timeval=None, localtime=False, usegmt=True)
      signature = encrypt(
          SECRET_KEY,
          'date: ' + date
      )

      info = {
          'firstname': firstname,
          'lastname': lastname
      }
      if (cap):
          info['cap'] = cap

      data = {
          'email': email,
          'info': json.dumps(info),
          'lists': [10]
      }

      req = urllib2.Request('https://tazebao.sqrt64.it/api/v1/newsletter/subscriber/') # noqa
      req.add_header('Content-Type', 'application/json')
      req.add_header('Accept', 'application/json')
      req.add_header('Cache-Control', 'no-cache')
      req.add_header('Date', date)
      req.add_header('X-Api-Key', API_KEY)
      req.add_header('Authorization', 'Signature keyId="' + API_KEY + '",algorithm="hmac-sha256",headers="date",signature="' + signature + '"') # noqa

      try:
          response = urllib2.urlopen(req, json.dumps(data))
      except urllib2.HTTPError as e:
          result = 'HTTP error'
      except urllib2.URLError as e:
          result = 'Connection error'
      else:
          result = response.read() # contains the subscriber json

      return result
  `
  return (
    <Code codeString={code} language='python' />
  )
}

PythonIntegration.propTypes = {
  client: PropTypes.object
}

export default PythonIntegration
