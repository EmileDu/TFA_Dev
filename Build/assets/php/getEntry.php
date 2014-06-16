<?php

	try{ $bdd = new PDO('mysql:host=localhost;dbname=EmileMetaTFA','root','root'); } 
	catch (Exception $e){ die('Erreur: '. $e->getMessage()); }
	$req = $bdd->query('SELECT * FROM visitor');
	$data = array();
	while($d = $req->fetch()){
		$data[] = $d;
	}
	$req->closeCursor();
	echo json_encode($data);

?>
