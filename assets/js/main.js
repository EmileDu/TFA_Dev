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