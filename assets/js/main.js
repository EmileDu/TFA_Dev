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
		if (browserWidth >= 1024) 
		{
			pageUnits = 'px';
			colUnits = 'px';
			pagewidth = 960;
			columns = 12;
			columnwidth = 55.25;
			gutterwidth = 27;
			pagetopmargin = 0;
			rowheight = 27;
			gridonload = 'on';
			makehugrid();
		} 
		if (browserWidth <= 1023) 
		{
			pageUnits = '%';
			colUnits = '%';
			pagewidth = 94;
			columns = 6;
			columnwidth = 48;
			gutterwidth = 4;
			pagetopmargin = 35;
			rowheight = 20;
			gridonload = 'on';
			makehugrid();
		}
		if (browserWidth <= 640) 
		{
			pageUnits = '%';
			colUnits = '%';
			pagewidth = 96;
			columns = 2;
			columnwidth = 49;
			gutterwidth = 2;
			pagetopmargin = 35;
			rowheight = 20;
			gridonload = 'on';
			makehugrid();
		}
	}

	$(document).ready(function(){
		
		SHORT_NAME.init();
		
		definegrid();
		setgridonload();  
			
	});//close document ready
	
	$(window).resize(function() {
		
		definegrid();
		setgridonresize();
		
	});

})(jQuery);