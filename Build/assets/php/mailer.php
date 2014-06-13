<?php
	if($_SERVER["REQUEST_METHOD"] == "POST"){ 

		$name = stripslashes(strip_tags($_POST["nom"]));
		$email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
		$message = stripslashes(strip_tags($_POST["message"]));

		// Check of valid value
		if( empty($name) OR empty($message) or !filter_var($email, FILTER_VALIDATE_EMAIL)){
			http_response_code(400);
			echo "Vous n'avez pas rempli tous les champs ou mal rempli un champ.";
			exit;
		}

		// Building email 

		$recipient = "bonjour@emileduval.be";
		$subject = "[emileduval.be] ". $name ." vous a contacter";
		$content = "Salut Emile, je m'appelle ".$name."\r\n";
		$content .= "Et mon adresse mail est ".$email."\r\n";
		$content .= "Je vouslais te dire que ".$message."\r\n";

		$header = "From: ". $nom ."<".$email.">\r\n";
		$header .= "Reply-To: ".$email."\r\n";
		$header .= "MIME-Version: 1.0";
		$header .= "Content-Type: text/plain; charset='ISO-8859-1'; format=flowed \r\n";
		$header .= "Content-Transfer-Encoding: 7bit \r\n";

		if(mail($recipient, $subject, utf8_decode($content), $header)){
			http_response_code(200);
			echo "Votre message a bien été envoyé.";
		} else {
			http_response_code(500);
			echo "Une erreur c'est produite, votre message n'a pas été envoyé.";
		}
	} else {
		http_response_code(403);
		echo "Une erreur c'est produite, votre message n'a pas été envoyé.";
	}
?>
