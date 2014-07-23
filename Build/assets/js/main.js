(function ($) {
	
	//-----------------
	/*    Variable   */
	//-----------------
	
	var valid = true,
			data,
			nbPays,
			pays,
			zoneHeight,
			zoneWidth,
			c,
			ctx,
			regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i;
	
	//-----------------
	/*    Function   */
	//-----------------
	
	
	// Update header Height to always match with baseline
	function headerHeight(){
		var $headerHeight = $('.header').outerHeight();
		if ($headerHeight % 27 != 0) {
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
	}
	
	function checkValue(name, value){
		var message = '';
		switch(name){
			case 'nom':
				if(value == ''){
					valid = false;
					message = 'J\'aimerai vraiment savoir ton nom.';
				} else {
					valid = true;	
				}
				break;
			case 'email':
				if(value == ''){
					valid = false;
					message = 'J\'aimerai vraiment connaitre ton mail.';
				} else if (value != '' && !regex.test(value)){
					valid == false;
					console.log(regex.test(value));
					message = 'Allez, donne moi ton vrai email.';
				} else {
					valid == true;
				}
				break;
			case 'message':
				if(value == ''){
					valid = false;
					message = 'Tu veux même pas me dire bonjour ?';
				} else {
					valid = true;	
				}
				break;
		}
		return message;
	}
	
//	 Define grid setup for each resolution ( desktop, tablet, mobile )
	definegrid = function () {
		var browserWidth = $(window).width();
		if (browserWidth >= 1025) {
			pageUnits = 'px';
			colUnits = 'px';
			pagewidth = 960;
			columns = 12;
			columnwidth = 55.25;
			gutterwidth = 27;
			pagetopmargin = 27;
			rowheight = 27;
			gridonload = 'off',
			makehugrid();
		}
		if (browserWidth <= 1024) {
			pageUnits = '%';
			colUnits = '%';
			pagewidth = 92;
			columns = 6;
			columnwidth = 15;
			gutterwidth = 2;
			pagetopmargin = 27;
			rowheight = 27;
			gridonload = 'off';
			makehugrid();
		}
		if (browserWidth <= 640) {
			pageUnits = '%';
			colUnits = '%';
			pagewidth = 92;
			columns = 2;
			columnwidth = 47;
			gutterwidth = 6;
			pagetopmargin = 27;
			rowheight = 27;
			gridonload = 'off';
			makehugrid();
		}
	}
	
	// End of loading function -------------------------------------------
	
	function getUserInfo(){
		$.get('http://ipinfo.io', function(response){
			var userdata = {ip:response.ip, country:response.country};
			sendToServer(data);
		}, 'jsonp');	
	}
	
	function sendToServer(userdata){
		$.post('assets/php/addEntry.php', userdata, 'json')
		.done(fetchData());
	}
	
	function fetchData(){
		$.post('assets/php/getEntry.php', function(response){
			data = response;
			initExperiment();	
		},'json');
	}
	
	function initExperiment(){
		nbPays = 1;
		pays = [];
		pays.push(data[0].country);
		for(var i = 1; i < data.length; i++){
			flag = false;
			for(var y = 0; y < pays.length; y++){
				if(data[i].country == pays[y]){
					flag = true;
				}
			}
			if(flag == false){
				pays.push(data[i].country);
				nbPays++;	
			}
		};
		
		
		c = document.getElementById('experiment');
		ctx = c.getContext('2d');
		
		
		updateSize();
		drawExperiment(data, zoneHeight, zoneWidth, nbPays, pays);
		
	}	
	
	function updateSize(){
		size = getHeaderSize();
		c.width = size.width;
		c.height = size.height;
		
		zoneHeight = ((size.height / 100) * 10) + ((size.height / 100) * 80);
		zoneWidth = ((size.width / 100) * 10) + ((size.width / 100) * 80);
	}
	
	function resizeCanvas(){
		updateSize();
		drawExperiment(data, zoneHeight, zoneWidth, nbPays, pays);
	}
	
	function drawExperiment(data, zoneHeight, zoneWidth, nbPays, pays){
		var previous = {};

		$.each(data, function(index, value){
			date = new Date(value.date);
			hours = date.getHours();
			day = date.getDate();
			var now = new Date().getDate();

			var y = ( zoneHeight / 23 ) * hours;
			var x = ( zoneWidth / (nbPays + 1)) * (pays.indexOf(value.country) + 1);
			var radius = 27;
			var opacity = 1;

			if((now - day) >= 30){
				opacity = .1;
				radius = 5;
			} else if((now - day) >= 15 && (now - day) < 30 ){
				opacity = .2;
				radius = 8;
			} else if((now - day) >= 7 && (now - day) < 15 ){
				opacity = .4;
				radius = 12;
			} else if((now - day) > 0 && (now - day) < 7 ){
				opacity = .7;
				radius = 17;
			} else {
				opacity = 1;
				radius = 27;
			}

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'white';
			ctx.fill();		
			ctx.closePath();

			if (previous != ''){
				ctx.beginPath();
				ctx.moveTo(previous.x, previous.y);
				ctx.lineTo(x, y);
				ctx.strokeStyle = 'white';
				ctx.stroke();
				ctx.restore();
				ctx.closePath();
			}
			previous = {x:x, y:y};
			
		});	
	}
	
	function getHeaderSize(){
		return {
			height: $('#experiment')[0].clientHeight,
			width: $('#experiment')[0].clientWidth
		}
	}
	
	// Call when DOM is ready and wait for document fully loaded, to call init function and end loading
	function preinit(){
		if($('body').hasClass('home')){
			getUserInfo();
		}	
		init();
	}
	

	function init() {
		
		definegrid();
		setgridonload();
		
		headerHeight();					 	
		
		// Formulaire de contact
	
		
		// Replace placeholder if enter value is not valid
		$('input, textarea').on('focusout', function(ev){ $(this).attr('placeholder', checkValue($(this)[0].name, $(this)[0].value)) });
		
		$('#form--submit').on('click', function (ev) {
			ev.preventDefault();
			$('#contact-form').trigger('submit');
			return false;
		});

		$('#contact-form').on('submit', function(ev) {
			var nom = $('#form--nom').val();
			var mail = $('#form--email').val();
			var message = $('#form--message').val();
			if (valid){
				if (nom == '' || mail == '' || message == ''){
					console.log('champ non remplis');
				} else {
					$.ajax({
						type: $(this).attr('method'),
						url:$(this).attr('action'), 
						data: $(this).serialize(),
						beforeSend: function(){
							$('#form--submit').addClass('is-on-progress');
						},
						xhrFields:{
							onprogress: function(ev){
								var progress = ev.loaded / ev.totalSize * 100;
							}
						}
					})
					.done(function(data){
						$('#form--submit').removeClass('is-on-progress');
						$('#form--submit').addClass('is-done');
						$('#contact-form')[0].reset();
						$('#form--nom').attr('placeholder', 'ton nom');
						$('#form--email').attr('placeholder', 'ton email');
						$('#form--message').attr('placeholder', 'ton message');
					})
					.fail(function(data){
						$('#form--submit').removeClass('is-on-progress');
						$('#form--submit').addClass('is-fail');
					});
				}
			}
			return false;
		});
		
		$('input, textarea').on('focusin', function(){
			if ($('#form--submit').hasClass('is-done')){
				$('#form--submit').removeClass('is-done')
			} else if($('#form--submit').hasClass('is-fail')){
				$('#form--submit').removeClass('is-fail');
			}
		});
	}
	
	// When DOM is ready, show loading animation and call preinit function
	$(document).ready(function () { 
		preinit();
	}); 
	
	// On resize call grid function for update him
	$(window).resize(function () {
		definegrid();
		setgridonresize();
		resizeCanvas();
	});

})(jQuery);