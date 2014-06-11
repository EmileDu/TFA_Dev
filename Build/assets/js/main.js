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
					message = 'J\'aimerai vraiment savoir votre nom.';
				} else {
					valid = true;	
				}
				break;
			case 'email':
				if(value == ''){
					valid = false;
					message = 'J\'aimerai vraiment connaitre votre mail.';
				} else {
					valid = true;	
				}
				break;
			case 'message':
				if(value == ''){
					valid = false;
					message = 'Vous voulez même pas me dire bonjour ?';
				} else {
					valid = true;	
				}
				break;
		}
		return message;
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

		$('[data-ajaxLink]').on('click tap', function (ev) {
				ev.preventDefault();
				var src = $(this).attr('href');
				$.ajaxSetup({
					async: true
				});
				$.ajax({
					type: 'GET',
					dataType: 'html',
					url: src,
					beforeSend: function () {
						$('.loading').show();
					},
					complete: function () {
						$('.loading').hide();
					},
					success: function (response) {
						console.log($(response).find('content'));
						$('#content').html($(response).find('content').html());
					}
				});
		});
		
		$('input, textarea').on('focusout', function(ev){
			var output = checkValue($(this)[0].name, $(this)[0].value);
			$(this).css('border','1xp solid red');
			$(this).attr('placeholder', output);
		});
				
		$('#form--submit').on('click', function (ev) {
			ev.preventDefault();
<<<<<<< HEAD
            $('.loading').show();
			var urlHref = $(this).attr('href');
			$.get( urlHref, function(response){
              console.log($('#content', response));
              $('#content').replaceWith($(response)[81].innerHTML);
            }, "html" )
            .done(function(){
              $('.loading').hide();
            })
            .fail(function(){

            })
            .progress(function(){
              console.log('progress');
            })
=======
			$('#contact-form').trigger('submit');
			return false;
		});

		$('#contact-form').on('submit', function(ev) {
			console.log($(this).attr('action'));
			var nom = $('#form--nom').val();
			var mail = $('#form--mail').val();
			var message = $('#form--message').val();
			if (valid){
				if (nom == '' || mail == '' || message == ''){
					console.log('champ non remplis');
				} else {
					$.ajax({
						type: $(this).attr('method'),
						url: $(this).attr('action'),
						data: $(this).serialize(),
						dataType: 'json',
						success: function(){
							alert('Formulaire bien envoyé');
						},
						error: function(){
							alert('Formulaire non envoyé');
						}
					});
				}
			}
			return false;
>>>>>>> commit
		});
	}
	
	$(document).ready(function () {
		preinit();
	}); //close document ready

	$(window).resize(function () {
		console.log('resize');
		definegrid();
		setgridonresize();

	});

})(jQuery);