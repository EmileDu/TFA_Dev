<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php

	if(isset($_POST) && isset($_POST['nom']) && isset($_POST['email']) && isset($_POST['message'])){
		// CONDITIONS NOM
		if ( (isset($_POST['nom'])) && (strlen(trim($_POST['nom'])) > 0) ){
			$nom = stripslashes(strip_tags($_POST['nom']));
		} else {
			echo "Merci d'écrire un nom <br />";
			$nom = '';
		}

		// CONDITIONS EMAIL
		if ( (isset($_POST['email'])) && (strlen(trim($_POST['email'])) > 0) && (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) ){
			$email = stripslashes(strip_tags($_POST['email']));
		} elseif (empty($_POST['email'])){
			echo "Merci d'écrire une adresse email <br />";
			$email = '';
		} else {
			echo 'Email invalide :(<br />';
			$email = '';
		}

		// CONDITIONS MESSAGE
		if ( (isset($_POST['message'])) && (strlen(trim($_POST['message'])) > 0) ){
			$message = stripslashes(strip_tags($_POST['message']));
		} else {
			echo "Merci d'écrire un message<br />";
			$message = '';
		}


		$destinataire = "duval.emile@gmail.com";
		$objet        = "[emileduval.be] " . $nom . " vous a contacter";
		$contenu   	  = "Salut Emile, je m'appelle " . $nom . "\r\n";
		$contenu 		 .= "Et mon adresse mail est " . $email . "\r\n";
		$contenu 		 .= "Je voulais te dire que " . $message . "\r\n\n";

		$headers  = 'From: ' . $email . '\r\n'; // ici l'expediteur du mail
		$headers .= 'Reply-To' . $email . '\r\n';
		$headers .= 'MIME-Version: 1.0';
		$headers .= 'Content-Type: text/plain; charset="ISO-8859-1"; format=flowed \r\n';
		$headers .= 'Content-Transfer-Encoding: 7bit \r\n';


		// SI LES CHAMPS SONT MAL REMPLIS
		if ( (empty($nom)) && (empty($sujet)) && (empty($email)) && (!filter_var($email, FILTER_VALIDATE_EMAIL)) && (empty($message)) ){
				$reponse 'Vous n\'avez pas rempli tous les champs.';
		// ENCAPSULATION DES DONNEES 
		} else {
				mail($destinataire,$objet,utf8_decode($contenu),$headers);
				echo 'ok';
		}
	}

	$array['reponse'] = $reponse;
	echo json_encode($array);

?>
