<?php
	if($_SERVER["REQUEST_METHOD"] == "POST"){ 
		if(!$_POST['page']){
			http_response_code(400);
			echo "Vous n'avez demandé aucune page";
			exit;
		} 

		$page = $_POST['page'];

		if(file_exists('../../'.$page)){
			echo loadHTMLFile('../../'.$page);
		} else {
			http_response_code(404);
			echo "La page ".$page." que vous demandez n'existe pas";
			exit;
		}
	} else {
		http_response_code(403);
		echo "Une erreur c'est produite. La page ne peut pas etre charger";
	}
?>
