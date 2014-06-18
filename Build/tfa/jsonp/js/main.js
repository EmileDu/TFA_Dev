$(document).ready(function() {
  var max = 0;
	
	// Function used to return random number between 50 and 200
  function randomNumb(){
    return 50 + Math.round(Math.random())* 150;
  }
	
	// Fetch data 
  $.getJSON("http://christian-delfosse.infographie-heaj.eu/TFA.php?callback=?", function(data){
		
    max = data[0].value;
    for(var i = 0; i < data.length; i++){ // Search the biggest value
			if( data[i].value > max){
        max = data[i].value;
      }
    }
		
		
    for(var key in data){ 
      var taille = 100 + (data[key].value / max) * 100; // Translate value into size between 100 and 200 in function of value;
      var country = data[key].country; 
			var value = data[key].value;
      var top = (($(window).height() / 100) * 20) + Math.random() * ($(window).height() - (($(window).height() / 100) * 40) ); // random position
      var left =(($(window).width() / 100) * 20) + Math.random() * ($(window).width() - (($(window).width() / 100) * 40) );	// random position
      var randomColor = 'rgba('+randomNumb()+','+randomNumb()+','+randomNumb()+',.5)';
			// append round width country and value intro html
      $('.main').append('<div class="round" id="'+ country +'"><span class="country">'+country +'</span><span class="value">'+ value +'</span></div>');
      $('#'+country).css({
        width: taille+'px',
        height: taille+'px',
        top: top+'px',
        left: left+'px',
        background: randomColor
      });
    }
  });
  
});
