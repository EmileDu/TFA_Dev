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
			gridonload = 'on';
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
			gridonload = 'on';
			makehugrid();
		}
	}

	$(document).ready(function(){
		
		SHORT_NAME.init();
		
		definegrid();
		setgridonload(); 
		
		var $headerHeight = $('.header').outerHeight();
		if ( $headerHeight % 27 != 0 ){
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
			
	});//close document ready
	
	$(window).resize(function() {
		console.log('resize');
		definegrid();
		setgridonresize();
		
	});

})(jQuery);