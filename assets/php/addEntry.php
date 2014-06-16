<?php

	try{ $bdd = new PDO('mysql:host=localhost;dbname=EmileMetaTFA','root','root'); } 
	catch (Exception $e){ die('Erreur: '. $e->getMessage()); }

	if($_SERVER["REQUEST_METHOD"] == "POST"){ 

		extract($_POST);
		$date = date('Y-m-d H:i:s');
		$req = $bdd->prepare('INSERT INTO visitor(ip,country,date) VALUES(:ip, :country, :date)');
		$req ->execute(array(
			'ip' => $ip,
			'country' => $country,
			'date' => $date
		));
		
		echo 'ok';
	}
?>
