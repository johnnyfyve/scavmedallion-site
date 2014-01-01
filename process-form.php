<?php
// *** Form processing code

// *** First get variables
$requestName = $_POST["name"];
$requestEmail = $_POST["email"];  
$requestMessage = $_POST["message"];

// *** Then assemble email
$emailMessage = "Dear SCAVMedallion.com Site Admin:\n\nThe following message was sent through the SCAVMedallion.com contact form:\n\nFrom:  ".$requestName."\nEmail: ".$requestEmail."\nMessage:\n\n".wordwrap($requestMessage, 70, "\r\n")."\n\nSCAVMedallion.com";

$headers = 'From: carolinaaviationmedallion@gmail.com' . "\r\n" .
    'Reply-To: carolinaaviationmedallion@gmail.com' . "\r\n" .
    'CC:johnnyfyve@gmail.com';

// *** Send email to recipients
mail('johnnyfyve@gmail.com, carolinaaviationmedallion@gmail.com', 'SCAVMedallion.com site contact request', $emailMessage, $headers);

// *** Create repsonse message for form page
//echo('Thank you - your request has been sent.'.$requestName.', '.$requestEmail.', '.$requestMessage);
echo('Thank you - your request has been sent.');

?>