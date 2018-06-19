<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
echo "aa";
$curl = curl_init();
//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt_array($curl, array(
  CURLOPT_PORT => "13060",
  CURLOPT_URL => "https://www.mytrintrin.com:13060/api/gateway",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_SSL_VERIFYPEER=>0,
  CURLOPT_SSL_VERIFYHOST=>0,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "order_status=0300&comments=test&credit=1&creditMode=online&transactionNumber=12&paymentdate=1/1/2017&userId=197&order_id=123&bank_ref_no=123&failure_msg=none&card_name=12&status_code=0300&status_msg=123&membershiptypeid=1&paymentfor=Topup&customer_notes=test",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "content-type: application/x-www-form-urlencoded",
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);


?>

