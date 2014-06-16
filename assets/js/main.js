(function ($) {
	
	//-----------------
	/*    Variable   */
	//-----------------
	
	var valid = true,
			rootUrl = History.getRootUrl(),
			data,
			nbPays,
			pays,
			zoneHeight,
			zoneWidth,
			c = document.getElementById('canvas-header'),
			ctx = c.getContext('2d');
	
	
	//-----------------
	/*    Function   */
	//-----------------
	
	
	// HTML Helper
	var documentHtml = function(html){
		// Prepare
		var result = String(html)
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|script|link)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
		;

		// Return
		return $.trim(result);
	};
	
	// Define grid setup for each resolution ( desktop, tablet, mobile )
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
	
	// Show the loading animation on loading start
	function startLoading(){
		console.log('start loading');
		$('#loading').show();
	}
	
	
	// 
	function progressLoading(){
		console.log('progress loading');
	}
	
	
	// When loading is finish succesfully
	function doneLoading(data, textStatus, jqXHR, url, title, relativeUrl){
		console.log('done loading');
		var $data = $(documentHtml(data)),
				$dataBody = $data.find('.document-body:first'),
				$dataContent = $dataBody.find('#content').filter(':first'),
				$dataContent = $dataContent[0].innerHTML,
				curpage = window.location.pathname.split('/').pop(),
				homepage = rootUrl;
		$('#content').html($dataContent);
		$('body').removeClass().addClass(title);
		document.title = $data.find('.document-title:first').text();
		
		// Inform Google Analytics of the change
		if ( typeof window._gaq !== 'undefined' ) {
			window._gaq.push(['_trackPageview', relativeUrl]);
		}
		
	}
	
	// When loading is finish but has fail
	function failLoading(data, textStatus, jqXHR, url){
		console.log('fail loading');
		document.location.href = url;
		return false;
	}
	
	
	// Hide loading animation on loading end
	function finishLoading(){
		console.log('finish loading');
		$('#loading').hide();	
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
				} else {
					valid = true;	
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

	// Update header Height to always match with baseline
	function headerHeight(){
//		$('.header').height($(window).height());
		var $headerHeight = $('.header').outerHeight();
		if ($headerHeight % 27 != 0) {
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
	}
	function getUserInfo(){
		$.get('http://ipinfo.io', function(response){
			var data = {ip:response.ip, country:response.country};
			sendToServer(data);
		}, 'jsonp');	
	}
	
	function sendToServer(data){
		$.post('assets/php/addEntry.php', data, function(response){
		}, 'json')
		.always(fetchData());
	}
	
	function fetchData(){
		$.post('assets/php/getEntry.php', function(response){
			data = response;
			initCanvas();
		},'json');
	}
	
	function initCanvas(){
		
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
		
		updateCanvasSize();
		drawHeader(data, zoneHeight, zoneWidth, nbPays, pays);
		
	}	
	
	function getHeaderSize(){
		return {
			height: $('.header')[0].clientHeight,
			width: $('.header')[0].clientWidth
		};
	}
	function updateCanvasSize(){
		size = getHeaderSize();
		c.width = size.width;
		c.height = size.height;
		
		zoneHeight = ((c.height / 100) * 10) + ((c.height / 100) * 80);
		zoneWidth = ((c.width / 100) * 10) + ((c.width / 100) * 80);
	}
	
	function resizeCanvas(){
		
		updateCanvasSize();
		drawHeader(data, zoneHeight, zoneWidth, nbPays, pays);
		
	}
	
	
	function drawHeader(data, zoneHeight, zoneWidth, nbPays, pays){
		
		var previous = {};
		
		$.each(data, function(index, value){
			date = new Date(value.date);
			hours = date.getHours();
			var y = ( zoneHeight / 23 ) * hours;
			var x = ( zoneWidth / (nbPays + 1)) * (pays.indexOf(value.country) + 1);
			ctx.beginPath();
			ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'white';
			ctx.fill();		
			if (previous != ''){
				ctx.beginPath();
				ctx.moveTo(previous.x, previous.y);
				ctx.lineTo(x, y);
				ctx.strokeStyle = 'white';
				ctx.stroke();
			}
			previous = {x:x, y:y};
		});
		
	}
	
	
	// Call when DOM is ready and wait for document fully loaded, to call init function and end loading
	function preinit(){
		getUserInfo();
		init();
	}
	

	function init() {
		
		definegrid();
		setgridonload();
		
		headerHeight();

		//Load page in ajax
		$('body').on('click tap', '[data-ajaxLink]',function(ev){
			var $this = $(this),
					url = $this.attr('href'),
					title = $this.attr('title') || null;
			$('body').animate({ scrollTop : 0}, 100);
			if ( ev.which == 2 || ev.metaKey ) { // If voluntarily opens in a new window ( cmd + click ) 
				return true; 
			}
			
			History.pushState(null, title, url);
			ev.preventDefault();
			return false;
			
		});
								 
		$(window).bind('statechange', function(ev){
			var State = History.getState(),
					url = State.url,
					title = State.title,
					relativeUrl = url.replace(rootUrl,'');
			
			$.ajax({
				url: url,
				beforeSend: startLoading(),
				xhrFields:{
					onprogress: progressLoading()
				},
			})
			.done(function(data, textStatus, jqXHR){
				doneLoading(data, textStatus, jqXHR, url, title, relativeUrl);
			})
			.fail(function(data, textStatus, jqXHR){
				failLoading(data, textStatus, jqXHR, url);
			})
			.always( finishLoading() );
			
		});					 
		
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
		init();
		
	}); 
	
	// On resize call grid function for update him
	$(window).resize(function () {
		definegrid();
		setgridonresize();
		resizeCanvas();
	});

})(jQuery);