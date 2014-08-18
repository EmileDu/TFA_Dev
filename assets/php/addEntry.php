<?php

	include "connect.php";

	if($_SERVER["REQUEST_METHOD"] == "POST"){ 

		extract($_POST);
		$date = date('Y-m-d H:i:s');
		$req = $bdd->prepare('INSERT INTO visitor(ip,country,date) VALUES(:ip, :country, :date)');
		$req ->execute(array(
			'ip' => $ip,
			'country' => $country,
			'date' => $date
		));
        var_dump($req -> errorInfo());
//		
//		echo 'ok';
	}
?>
