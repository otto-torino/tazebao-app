import React from 'react'
import PropTypes from 'prop-types'
import Code from 'react-code-prettify'

const PHPIntegration = props => {
  const code = `

  &lt;?php
  define('API_KEY', '${props.client.idKey}');
  define('SECRET_KEY', '${props.client.secretKey}');
  $Sig = base64_encode(hash_hmac('sha256', 'date: "'.gmdate('D, d M Y H:i:s T').'"', SECRET_KEY, true));
  $result = '';
  $headers = [
      'Accept: application/json',
      'Accept-Encoding: gzip, deflate',
      'Cache-Control: no-cache',
      'Content-Type: application/json; charset=utf-8',
      'Host: localhost:8000',
      'Date: "'.gmdate('D, d M Y H:i:s T').'"',
      'X-Api-Key: '.API_KEY,
      'Authorization: Signature keyId="'.API_KEY.'",algorithm="hmac-sha256",headers="date",signature="'.$Sig.'"'
  ];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // add subscriber
  // retreive data from POST
  $email = $_POST['s-email'];
  $info = $_POST['s-info'];
  $lists = $_POST['s-lists'];
  $fields = array(
      'email' => $email,
      'info' => $info,
      'lists' => explode(',', $lists)
  );
  curl_setopt($ch, CURLOPT_URL,"https://tazebao.sqrt64.it/api/v1/newsletter/subscriber/");
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_POST, count($fields));
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
  $server_output = curl_exec ($ch);
  curl_close ($ch);
  $result = $server_output;

  // lists should be an array of list ids, you can get yor list this way:
  curl_setopt($ch, CURLOPT_URL,"https://tazebao.sqrt64.it/api/v1/newsletter/subscriberlist/");
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $server_output = curl_exec ($ch);
  curl_close ($ch);
  $result = $server_output;

  // you can unsubscribe emails:
  $id = $_POST['s-id'];
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
  curl_setopt($ch, CURLOPT_URL,"https://tazebao.sqrt64.it/api/v1/newsletter/subscriber/".$id."/");
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $server_output = curl_exec ($ch);
  curl_close ($ch);
  $result = $server_output;
  `
  return (
    <Code codeString={code} language='php' />
  )
}

PHPIntegration.propTypes = {
  client: PropTypes.object
}

export default PHPIntegration
