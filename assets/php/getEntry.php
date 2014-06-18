<?php

	include "connect.php";
	$req = $bdd->query('SELECT * FROM visitor');
	$data = array();
	while($d = $req->fetch()){
		$data[] = $d;
	}
	$req->closeCursor();
	echo json_encode($data);

?>