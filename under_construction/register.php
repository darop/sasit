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

$return['success'] = false;
$valid = checkEmail($the_email);

//write CSV file?
if(CONF_SAVECSV && $valid){
	$return['success'] = saveAsCSV($the_email);	
}
//Send Email?
if(CONF_SENDMAIL && $valid){
	$return['success'] = sendIt($the_email);	
}
//Add to Mailchimnp list?
if(CONF_MAILCHIMP && $valid){
	$return['success'] = addToMailChimp($the_email);	
}
//Add to Mailchimnp list?
if(CONF_CAMPAIGNMONITOR && $valid){
	$return['success'] = addToCampaignMonitor($the_email);	
}
//output success as JSON
echo json_encode($return);






//Functions

//send Mail
function sendIt($email){
	$subject = 'New email on '.CONF_DOMAIN;
	$msg = 'Hello!'."\n";
	$msg .= '"'.$email.'" has just joined the List!'."\n\n";
	if(CONF_SAVECSV){
		$msg .= 'get the full list here: '.CONF_DOMAIN.'/'.CONF_CSVFILE."\n\n";
	}
	$header = 'From: Your Relaunch <'.CONF_EMAILADDRESS.'>' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();
	return true;
	return mail(CONF_EMAILADDRESS, $subject, $msg, $header);
}

//saves CSV File
function saveAsCSV($email){
	$f = @fopen(CONF_CSVFILE, 'a+');
	if (!$f) {
		return false;
	} else {
		$data = $email.';'.date('Y-d-m h:i:s')."\n"; 
		$bytes = fwrite($f, $data);
		fclose($f);
		return true;
	}
}

//add to MailChimp List
function addToMailChimp($email){

	require_once 'inc/mailchimp/MCAPI.class.php';
	
	$api = new MCAPI(CONF_MC_APIKEY);
	
	$merge_vars = array();
	
	$email_type = 'html';
	
	$retval = $api->listSubscribe(CONF_MC_LISTID, $email, $merge_vars, $email_type, false);
	
	if($api->errorCode){
		return false;
	} else {
		return true;
	}
}
//add to CampaignMonitor List
function addToCampaignMonitor($email){
	
	require_once 'inc/campaignmonitor/csrest_subscribers.php';
	
	$wrap = new CS_REST_Subscribers(CONF_CM_LISTID, CONF_CM_APIKEY);
	$result = $wrap->add(array(
		'EmailAddress' => $email,
		'Resubscribe' => true
	));
	
	if(!$result->was_successful()) {
		return false;
	} else {
		return true;
	}
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