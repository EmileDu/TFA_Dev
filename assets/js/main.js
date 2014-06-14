(function ($) {
	
	//-----------------
	/*    Variable   */
	//-----------------
	
	var valid = true,
			rootUrl = History.getRootUrl();
	
	
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
		$
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
		var $headerHeight = $('.header').outerHeight();
		if ($headerHeight % 27 != 0) {
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
	}
	
	// Call when DOM is ready and wait for document fully loaded, to call init function and end loading
	function preinit(){
		$(window).load(function () {
			init();
			finishLoading();
		});
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
		
		startLoading();
		preinit();
		
	}); 
	
	// On resize call grid function for update him
	$(window).resize(function () {
		definegrid();
		setgridonresize();
	});

})(jQuery);








//	startLoading();
//
//$('html body').hide()
//$(document).ready(function () { 
//	$('html body').fadeOut('slow', function() {
//		$('a[href], button[href]').click(function(event) {
//			var url = $(this).attr('href');
//			if (url.indexOf('#') == 0 || url.indexOf('javascript:') == 0) return;
//			event.preventDefault();
//			$('html body').fadeIn('slow', function() {
//				window.location = url;
//			});
//		});
//	});
//});