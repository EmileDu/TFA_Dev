(function ($) {
	valid = true;
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
					message = 'TU veux même pas me dire bonjour ?';
				} else {
					valid = true;	
				}
				break;
		}
		return message;
	}
	
	function startLoading(){
		$('.loading').show();
	}
	
	function progressLoading(){
		
	}
	
	function doneLoading(data, url, name){
		var title = $(data)[35].innerHTML;
		var content = $(data)[81].innerHTML;

		document.title = title;
		$('#content').html(content);
		$('body').attr('class', newClass);
		history.pushState({key: 'case-study'}, 'titre', url);
		finishLoading();
	}
	
	function failLoading(data){
		finishLoading();
	}
	
	function finishLoading(){
		$('.loading').hide();	
	}
	
	
	function loadAjax(ev){
		var url = $(this).attr('href');
		var name = $(this).attr('data-name');
		var newClass = $(this).attr('data-class');
		$.ajax({
				type: 'POST',
				url: $(this).attr('href'),
				dataType: 'HTML',
				data: {},
				beforeSend: startLoading(),						
				xhrFields:{
					onprogress: progressLoading()
				}
			})
			.done(doneLoading(data, url, name))
			.fail(failLoading(data));
	}
	
	function preinit() {
		$('.loading').show();
		$(window).load(function () {
			init();
			$('.loading').fadeOut();
		});
	}

	function init() {
		definegrid();
		setgridonload();
		var $headerHeight = $('.header').outerHeight();
		if ($headerHeight % 27 != 0) {
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}

		// Load page in ajax
		$('body').on('click tap', '[data-ajaxLink]',function(ev){
			loadAjax(ev);
			return false;
		});
		
		window.onpopstate = function(ev){
			if (event.state == ''){
				
			}
		}
		$('input, textarea').on('focusin', function(){
			if ($('#form--submit').hasClass('is-done')){
				$('#form--submit').removeClass('is-done')
			} else if($('#form--submit').hasClass('is-fail')){
				$('#form--submit').removeClass('is-fail');
			}
		});
		
		// Replace placeholder if enter value is not valid
		$('input, textarea').on('focusout', function(ev){
			var output = checkValue($(this)[0].name, $(this)[0].value);
			$(this).css('border','1xp solid red');
			$(this).attr('placeholder', output);
		});
				
		
		// Formulaire de contact 
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
	}
	
	$(document).ready(function () {
		preinit();
	}); //close document ready

	$(window).resize(function () {
		definegrid();
		setgridonresize();
	});

})(jQuery);