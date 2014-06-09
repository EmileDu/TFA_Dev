(function($){
	
	definegrid = function() {
		var browserWidth = $(window).width(); 
		if (browserWidth >= 1025) 
		{
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
		if (browserWidth <= 1024) 
		{
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
		if (browserWidth <= 640) 
		{
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

	function preinit(){
		$('.loading').show();
		$(window).load(function(){
			init();
			$('.loading').fadeOut();
		});
	}
	
	function init(){
		definegrid();
		setgridonload(); 
		
		var $headerHeight = $('.header').outerHeight();
		if ( $headerHeight % 27 != 0 ){
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
		
		$('[data-ajaxLink]').on('click tap', function(ev){
			ev.preventDefault();
			var src = $(this).attr('href');
			$.ajaxSetup({async: true});
			$.ajax({
				type: 'GET',
				dataType: 'html',
				url: src,
				beforeSend: function(){
					$('.loading').show();
				},
				complete: function(){
					$('.loading').hide();	
				},	
				success: function(response){
					console.log($(response).find('content'));
					$('#content').html($(response).find('content').html());
				}
			});
		});
	}	
	$(document).ready(function(){
		preinit();	
	});//close document ready
	
	$(window).resize(function() {
		console.log('resize');
		definegrid();
		setgridonresize();
		
	});
	
	

})(jQuery);