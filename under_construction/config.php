<?php
// Enter your domain without trailing slash
$config['domain'] = 'http://www.example.com/sub';


// Would you like to recieve an email if someone subscribe?
$config['sendmail'] = true;
// Your email address for subscribers and contact form
$config['emailaddress'] = 'some@example.com';




// Should a csv file be generated?
$config['savecsv'] = false;
// the name of the CSV file
$config['csvfile'] = 'emails.csv';




// Use MailChimp? (http://www.mailchimp.com/)
$config['mailchimp'] = false;

// API Key - get won at http://admin.mailchimp.com/account/api-key-popup
$config['mc_apikey'] = 'YOUR MAILCHIMP APIKEY';
    
// Login to MC account, go to List, then settings, and look for the List ID entry
$config['mc_listId'] = 'YOUR MAILCHIMP LIST ID';




// Use Campaignmonitor? (http://www.campaignmonitor.com/)
$config['campaignmonitor'] = false;

// API Key - see http://www.campaignmonitor.com/api/
$config['cm_apikey'] = 'YOUR CAMPAIGNMONITOR APIKEY';
    
// Login to CM account, select a client from the list, go to Lists & Subscribers, then select or create a list, and go to 'change name/type'
$config['cm_listId'] = 'YOUR CAMPAIGNMONITOR LIST ID';
 
 
 
 


// do not edit beneath this point

// make some constants for easy access
foreach($config as $conf => $val){
	define('CONF_'.strtoupper($conf),$val);
}