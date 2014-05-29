(function($){

	window.PROJECT_NAME = {};

	var SHORT_NAME = window.PROJECT_NAME;

	SHORT_NAME.init = function(){
		SHORT_NAME.setElements();
		SHORT_NAME.basics();
	}

	SHORT_NAME.setElements = function(){
		SHORT_NAME.elems = {};
	}
	
	SHORT_NAME.basics = function(){

	}

	$(window).load(function() {

	});

	
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
			gridonload = 'on',
			makehugrid();
		} 
		if (browserWidth <= 1000) 
		{
				pageUnits = '%';
				colUnits = '%';
				pagewidth = 92;
				columns = 2;
				columnwidth = 47;
				gutterwidth = 6;
				pagetopmargin = 27;
				rowheight = 27;
				gridonload = 'on';
				makehugrid();
		}
		if (browserWidth <= 768) 
		{
				pageUnits = '%';
				colUnits = '%';
				pagewidth = 92;
				columns = 2;
				columnwidth = 47;
				gutterwidth = 6;
				pagetopmargin = 27;
				rowheight = 27;
				gridonload = 'on';
				makehugrid();
		}
	}

	$(document).ready(function(){
		
		SHORT_NAME.init();
		
		definegrid();
		setgridonload(); 
		
		var $headerHeight = $('.header').height();
//		var $titleOffset = $('.header .header-title').offset();
//		var $subtitleOffset = $('.header .header-subtitle').offset();
		if ( $headerHeight % 27 != 0 ){
			$('.header').height(Math.ceil($headerHeight / 27) * 27);
//			title = Math.floor($titleOffset / 27) * 27;
//			subtitle = Math.floor($subtitleOffset / 27) * 27
//			$('.header .header-title').offset({top: title, left: $titleOffset.left});
//			$('.header .header-subtitle').offset({top: subtitle, left: $subtitleOffset.left});
		}
			
	});//close document ready
	
	$(window).resize(function() {
		
		definegrid();
		setgridonresize();
		
	});

})(jQuery);