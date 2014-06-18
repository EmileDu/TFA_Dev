$(document).ready(function() {
  var min = 0;
  var max = 0;
  function randomNumb(){
    return 50 + Math.round(Math.random())* 205;
  }
  $.getJSON("http://christian-delfosse.infographie-heaj.eu/TFA.php?callback=?", function(data){
    console.log(data);
//    min = data[0].value;
//    max = data[0].value;
//    for(var i = 0; i < data.length; i++){
//      if( data[i].value < min){
//        min = data[i].value;
//      } else if( data[i].value > max){
//        max = data[i].value;
//      }
//    }
//    
//    for(var key in data){
//      var taille = data[key].value / 500000;
//      var country = data[key].country;
//      var top = (($(window).height() / 100) * 20) + Math.random() * ($(window).height() - (($(window).height() / 100) * 40) );
//      var left =(($(window).width() / 100) * 20) + Math.random() * ($(window).width() - (($(window).width() / 100) * 40) );
//      var randomColor = 'rgba('+randomNumb()+','+randomNumb()+','+randomNumb()+',.5)';
//      $('.main').append('<div class="round" id="'+ country +'"><span class="country">'+country +'</span></div>');
//      $('#'+country).css({
//        width: taille+'px',
//        height: taille+'px',
//        top: top+'px',
//        left: left+'px',
//        background: randomColor
//      });
//      console.log(data[key].country + ' : ' + data[key].value + '</br>');
//    }
  });
  
});
