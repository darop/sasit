<?php
//Stop if no Ajax request
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
	header('Location: ./');
	exit;
}
if (function_exists ('ini_set')){
	//prevent display errors
  ini_set("display_errors", 0);
  	//but log them
  ini_set('log_errors', 1 ); 
  	//in the document root
  ini_set('error_log', getcwd().'/php_error.log' );
}
//just for development
//error_reporting (E_ALL);

//include the config file
include('config.php');

$the_email = addslashes($_POST["email"]);
$the_name = addslashes(utf8_decode($_POST["name"]));
$the_msg = addslashes(utf8_decode($_POST["msg"]));



$return['success'] = false;
$valid = checkEmail($the_email);

//Send Email?
if($valid){
	$return['success'] = sendIt($the_email, $the_name, $the_msg);	
}
//output success as JSON
echo json_encode($return);






//Functions

//send Mail
function sendIt($email, $name, $msg){
	$subject = 'New mail from '.CONF_DOMAIN;
	$header = 'From: '.$name.' <'.$email.'>' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();
	return mail(CONF_EMAILADDRESS, $subject, $msg, $header);
}


//verify the email
function checkEmail($email){
	return ($email && preg_match('#^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$#',$email));	
}

if (!function_exists('json_encode'))
{
  function json_encode($a=false)
  {
    if (is_null($a)) return 'null';
    if ($a === false) return 'false';
    if ($a === true) return 'true';
    if (is_scalar($a))
    {
      if (is_float($a))
      {
        // Always use "." for floats.
        return floatval(str_replace(",", ".", strval($a)));
      }

      if (is_string($a))
      {
        static $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
        return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $a) . '"';
      }
      else
        return $a;
    }
    $isList = true;
    for ($i = 0, reset($a); $i < count($a); $i++, next($a))
    {
      if (key($a) !== $i)
      {
        $isList = false;
        break;
      }
    }
    $result = array();
    if ($isList)
    {
      foreach ($a as $v) $result[] = json_encode($v);
      return '[' . join(',', $result) . ']';
    }
    else
    {
      foreach ($a as $k => $v) $result[] = json_encode($k).':'.json_encode($v);
      return '{' . join(',', $result) . '}';
    }
  }
}
?>