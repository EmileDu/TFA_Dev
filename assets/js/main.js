(function ($) {
	
	//-----------------
	/*    Variable   */
	//-----------------
	
	var valid = true,
			data,
			c = document.querySelector('canvas'),
			ctx = c.getContext('2d'),
			regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i,
			particules = [],
			coef = .25,
			mousePos = {},
			connected = [],
			lastID = 0;
	
	//-----------------
	/*     Class     */
	//-----------------  

		// Particule class
    function Particule(radius, opacity, pays, date, color){
      this.id = getID();
      
      if(this.id === 0){
        this.position = {x: (c.width / 100) * 5 + Math.random() * (c.width / 100) * 90,
                         y: (c.height / 100) * 5 + Math.random() * (c.height / 100) * 90};
      } else {
        do{
          var collid = false;
          this.position = {x: (c.width / 100) * 5 + Math.random() * (c.width / 100) * 90,
                           y: (c.height / 100) * 5 + Math.random() * (c.height / 100) * 90};

          for(var i = 0; i < particules.length; i++){
            if(this.iscolliding(particules[i])){
              console.log('collid');
              collid = true;
            }
          }
        }while(collid === true);
      }

      
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;    
      
      this.opacity = opacity;
			this.saveOpacity = this.opacity;
      this.radius = radius;
      this.color = color || '#FFFFFF'; 
      this.info = { pays: pays, date: date};
      
    }
  
    Particule.prototype = {
			update: function(coef){
				
				// Update position
        this.position.x += this.vx * coef;
        this.position.y += this.vy * coef;

				//Check for mouse hover particule
				this.isMouseHover();
				
				//Check for connection with other particule
       	this.isConnected();
				var next = particules[this.id + 1];
				if(next){
					this.connection(next);
				}
			
        if(this.position.x > c.width - (this.radius / 2)) {
          this.position.x =  c.width - (this.radius / 2);
          this.vx *= -1;
        }
        else if(this.position.x < this.radius / 2) {
          this.position.x = this.radius / 2;
          this.vx *= -1;
        }
        if(this.position.y > c.height - (this.radius / 2)) {
          this.position.y = c.height - (this.radius / 2);
          this.vy *= -1;
        }
        else if(this.position.y < this.radius / 2) {
          this.position.y = this.radius / 2;
          this.vy *= -1;
        }
        
//         Check for particules collision 
//        for(var i = 0; i < particules.length; i++){
//          if(this.id != particules[i].id && this.iscolliding(particules[i])){
//            this.bounce(particules[i]);
//          }
//        }
      },
			draw: function(){ // Draw the particule 
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();		
        ctx.closePath();
      },
      drawConnection: function(connected){ // draw line between particule
        for(var i = 0; i < connected.length; i++){
          ctx.globalAlpha = .4;
          ctx.beginPath();
          ctx.moveTo(this.position.x, this.position.y);
          ctx.lineTo(connected[i].position.x, connected[i].position.y);
          ctx.lineWidth = .4;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
          ctx.closePath();
        }
      },
			connection: function(p){
				ctx.globalAlpha = .3;
				ctx.beginPath();
				ctx.moveTo(this.position.x, this.position.y);
				ctx.lineTo(p.position.x, p.position.y);
				ctx.lineWidth = .3;
				ctx.strokeStyle = '#eb7347';
				ctx.stroke();
				ctx.closePath();
			},
      display: function(){ // display visitor information when hover particule     
        var fulldate = new Date(this.info.date);
        var day = fulldate.getDay();
        var month = fulldate.getMonth();
        var year = fulldate.getFullYear();
        var date = ''+day+' / '+month+' / '+year+'';
				var pos = {x: this.position.x, y: this.position.y - 5, r: this.radius};
				if(this.position.x > c.width - 100){
					var align = 'right';
				} else {
					var align = 'left';
				}
        var info = {pays: this.info.pays, date: date};
        
        var tooltip = new Tooltip(pos, info, align);
        tooltip.show();
      },
      iscolliding: function(a){ //
        if (this.position.x + this.radius + a.radius > a.position.x 
          && this.position.x < a.position.x + this.radius + a.radius
          && this.position.y + this.radius + a.radius > a.position.y 
          && this.position.y < a.position.y + this.radius + a.radius){ 
          var ppx = this.position.x - a.position.x,
              ppy = this.position.y - a.position.y,
              ppdist = Math.sqrt(ppx * ppx + ppy * ppy);

          if (ppdist < this.radius + a.radius){
            return true;
          }
        }
        return false;
      },
			isMouseHover: function(){
				var mx = this.position.x - mousePos.x,
						my = this.position.y - mousePos.y,
						mdist = Math.sqrt(mx * mx + my * my);
				
        if((!this.dragging && mdist < this.radius) || this.dragging) {
          this.vy = 0;
          this.vx = 0;
          this.color = '#eb7347';
          this.opacity = 1;
          this.display();
        } else {
          this.opacity = this.saveOpacity;
          this.color = '#FFFFFF';
        }
			},
			isConnected: function(){
				connected = []
				for(var i = 0; i < particules.length; i++){
          var px = particules[i].position.x - this.position.x,
              py = particules[i].position.y - this.position.y,
              pdist = Math.sqrt(px * px + py * py);
          if(pdist < 150){
            connected.push(particules[i]);
          } 
        } 
        this.drawConnection(connected);
			},
      bounce: function(a){
				this.vx = (this.vx * (1 - 1) + (2 * 1 * a.vx)) / (1 + 1);
				this.vy = (this.vy * (1 - 1) + (2 * 1 * a.vy)) / (1 + 1);
				a.vx = (a.vx * (1 - 1) + (2 * 1 * this.vx)) / (1 + 1);
				a.vy = (a.vy * (1 - 1) + (2 * 1 * this.vy)) / (1 + 1);
					
				this.position.x += this.vx;
				this.position.y += this.vx;
				a.position.x += a.vx;
				a.position.y += a.vx;
      }
    };
  	
		// Tooltip class
    function Tooltip(pos, info, align){
      this.pos = pos;
      this.pays = this.resolvePays(info.pays);
      this.date = info.date;
			this.align = align || 'left';
    }
  
    Tooltip.prototype = {
      show: function(){
				ctx.globalAlpha = 1;
        ctx.font = '15px PT Sans';
				ctx.fillStyle = '#FFFFFF';
				ctx.textAlign = this.align;
				if(this.align != 'left'){
					ctx.fillText(this.pays, this.pos.x - this.pos.r - 10, this.pos.y);
					ctx.fillText('Le '+this.date, this.pos.x - this.pos.r - 10, this.pos.y + 20 );
				} else {
					ctx.fillText(this.pays, this.pos.x + this.pos.r + 10, this.pos.y);
					ctx.fillText('Le '+this.date, this.pos.x + this.pos.r + 10, this.pos.y + 20 );
				}        
      },
      resolvePays: function(ca2){
        console.log(ca2);
        var ca2tab = {AC: 'Antigua-et-Barbuda', AF: 'Afghanistan',  AG: 'Algérie', 
                      AJ: 'Azerbaïdjan',        AL: 'Albanie',      AM: 'Arménie',
                      AN: 'Andorre',            AO: 'Angola',       AR: 'Argentine',
                      AS: 'Australie',          AU: 'Autriche',     BA: 'Bahreïn',
                      BB: 'Barbade',            BC: 'Botswana',     BE: 'Belgique',
                      BF: 'Bahamas',            BG: 'Bangladesh',   BH: 'Belize',
                      BK: 'Bosnie-Herzégovine', BL: 'Bolivie',      BM: 'Birmanie',
                      BN: 'Bénin',              BO: 'Biélorussie',  BP: 'Salomon',
                      BR: 'Brésil',             BT: 'Bhoutan',      BU: 'Bulgarie',
                      BX: 'Brunei',             BY: 'Burundi',      CA: 'Canada',
                      CB: 'Cambodge',           CD: 'Tchad',        CE: 'Sri Lanka',
                      CF: 'République du Congo',CG: 'République démocratique du Congo',
                      CH: 'Chine',              CI: 'Chili',        CM: 'Cameroun',
                      CN: 'Comores',            CO: 'Colombie',     CS: 'Costa Rica',
                      CT: 'République centrafricaine',              CU: 'Cuba',
                      CV: 'Cap-Vert',           CY: 'Chypre',       CZ: 'République tchèque',
                      DA: 'Danemark',           DJ: 'Djibouti',     DO: 'Dominique',
                      DR: 'République dominicaine',                 EC: 'Équateur',
                      EG: 'Égypte',             EI: 'Irlande',      EK: 'Guinée équatoriale',
                      EN: 'Estonie',            ER: 'Érythrée',     ES: 'Salvador',
                      ET: 'Éthiopie',           FI: 'Finlande',     FJ: 'Fidji',
                      FR: 'France',             FY: 'Macédoine',    GA: 'Gambie',
                      GB: 'Gabon',              GE: 'Allemagne',    GG: 'Géorgie',
                      GH: 'Ghana',              GJ: 'Grenade',      GR: 'Grèce',
                      GT: 'Guatemala',          GV: 'Guinée',       GY: 'Guyana',
                      HA: 'Haïti',              HO: 'Honduras',     HR: 'Croatie',
                      HU: 'Hongrie',            IC: 'Islande',      ID: 'Indonésie',
                      IN: 'Inde',               IR: 'Iran',         PL: 'Israël',
                      IT: 'Italie',             IV: 'Côte Ivoire',  IZ: 'Irak',
                      JA: 'Japon',              JM: 'Jamaïque',     JO: 'Jordanie',
                      KE: 'Kenya',              KG: 'Kirghizistan', KN: 'Corée du Nord',
                      KR: 'Kiribati',           KS: 'Corée du Sud', KU: 'Koweït',
                      KZ: 'Kazakhstan',         LA: 'Laos',         LE: 'Liban',
                      LG: 'Lettonie',           LH: 'Lituanie',     LI: 'Liberia',
                      LO: 'Slovaquie',          LS: 'Liechtenstein',LT: 'Lesotho',
                      LU: 'Luxembourg',         LY: 'Libye',        MA: 'Madagascar',
                      MD: 'République de Moldavie',                 MG: 'Mongolie',
                      MI: 'Malawi',             ML: 'Mali',         MN: 'Monaco',
                      MO: 'Maroc',              MP: 'Maurice',      MR: 'Mauritanie',
                      MT: 'Malte',              MU: 'Oman',         MV: 'Maldives', 
                      MX: 'Mexique',            MY: 'Malaisie',     MZ: 'Mozambique',
                      NG: 'Niger',              NH: 'Vanuatu',      NI: 'Nigeria',
                      NL: 'Pays-Bas',           NO: 'Norvège',      NP: 'Népal',
                      NR: 'Nauru',              NS: 'Suriname',     NU: 'Nicaragua',
                      NZ: 'Nouvelle-Zélande',   PA: 'Paraguay',     PE: 'Pérou',
                      PK: 'Pakistan',           PL: 'Pologne',      PM: 'Panama',
                      PT: 'Portugal',           PP: 'Papouasie-Nouvelle-Guinée', 
                      PU: 'Guinée-Bissau',      QA: 'Qatar',        RO: 'Roumanie',
                      RP: 'Philippines',        RQ: 'Porto Rico',   RS: 'Russie',
                      RW: 'Rwanda',             SA: 'Arabie saoudite',
                      SC: 'Saint-Christophe-et-Niévès',           SE: 'Seychelles',
                      SF: 'Afrique du Sud',     SG: 'Sénégal',      SI: 'Slovénie',
                      SL: 'Sierra Leone',       SM: 'Saint-Marin',  SN: 'Singapour',
                      SO: 'Somalie',            SP: 'Espagne',      ST: 'Sainte-Lucie',
                      SU: 'Soudan',             SW: 'Suède',        SY: 'Syrie',
                      SZ: 'Suisse',             TC: 'Émirats arabes unis',
                      TD: 'Trinité-et-Tobago',  TM: 'Timor oriental',
                      TH: 'Thaïlande',          TI: 'Tadjikistan',  TN: 'Tonga',
                      TO: 'Togo',               TP: 'Sao Tomé-et-Principe',
                      TS: 'Tunisie',            TU: 'Turquie',      TV: 'Tuvalu',
                      TW: 'Taïwan',             TX: 'Turkménistan', TZ: 'Tanzanie',
                      UG: 'Ouganda',            UK: 'Royaume-Uni',  UP: 'Ukraine',
                      UR: 'Union soviétique',   US: 'États-Unis',   UV: 'Burkina Faso',
                      UY: 'Uruguay',            UZ: 'Ouzbékistan',  VC: 'Saint-Vincent-et-les Grenadines',
                      VE: 'Venezuela',          VN: 'Viêt Nam',     VT: 'Vatican',
                      WA: 'Namibie',            WS: 'Samoa',        WZ: 'Swaziland',
                      YE: 'Yémen',              YU: 'Serbie-et-Monténégro',
                      ZA: 'Zambie',             ZI: 'Zimbabwe'};
        return ca2tab[ca2];
      }
    }
  
	//-----------------
	/*    Function   */
	//-----------------
	
	// Return icremental number
	function getID(){
		return lastID++;
	}
	
	// Check mouse position on canvas.
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	
//	 Define grid setup for each resolution ( desktop, tablet, mobile )
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
    
	// Update header Height to always match with baseline
	function headerHeight(){
		var $headerHeight = $('.header').outerHeight();
		if ($headerHeight % 27 != 0) {
			$('.header').outerHeight(Math.ceil($headerHeight / 27) * 27);
		}
	}
  
	// Call ipinfo.io API to get user information
	function getUserInfo(){ 
      $.get('http://ipinfo.io', function(response){
        var userdata = {ip: response.ip, country: response.country};
        sendToServer(userdata); // Send data to MySQL bdd
      }, 'jsonp');	
	}
  
	// Insert new entry with user info into MySQL bdd
	function sendToServer(userdata){ 
      $.post('assets/php/addEntry.php', userdata, 'json')
      .done(fetchData());
	}
	
	// Fetch data into bdd to create dataviz
	function fetchData(){ 
      $.post('assets/php/getEntry.php', function(response){
        data = response;
        console.log(data.length);
        initExperiment(data);	
      },'json');
	}
  
    // 
	function resizeCanvas(){
      c.width = $('.header').outerWidth();
      c.height =  $('.header').outerHeight();
      ctx.setTransform(1,0,0,1,0,0);
    }
    
  
	function initExperiment(){
		resizeCanvas();
		$.each(data, function(index, value){

			var now = new Date().getDate();

			var pays = value.country;
			value.date = value.date.replace(/-/g, ' ');
			var date = new Date(value.date);
			var day = date.getDate();
			if((now - day) >= 30){
				var radius = 2;
				var opacity = 0.4;
			} else if((now - day) >= 15 && (now - day) < 30 ){
				var radius = 4;
				var opacity = 0.5;
			} else if((now - day) >= 7 && (now - day) < 15 ){
				var radius = 6;
				var opacity = 0.6;
			} else if((now - day) > 0 && (now - day) < 7 ){
				var radius = 10;
				var opacity = 0.7;
			} else {
				var radius = 15;
				var opacity = 0.8;
			}

			particules.push(
				new Particule(radius, opacity, pays, date)
			); 
		});  
	}
	function drawExperiment(){
		ctx.clearRect(0, 0, c.width, c.height);
		for (var i = 0; i < particules.length; i++) {
			var visitor = particules[i];
			visitor.update(coef);
			visitor.draw();
		}
		window.requestAnimFrame(drawExperiment);
	}
	
	function init() {
		if($('body').hasClass('home')){
			getUserInfo();
		}
		
		// Define and setup the grid 
		definegrid();
		setgridonload();
		
		// Update the header height to match with baseline
		headerHeight();		
		
		
		// Formulaire de contact
	
		
		// Replace placeholder if enter value is not valid
		$('.contact-form-input--name').on('focusout', function(ev){
			if($(this)[0].value === ''){
				valid = false;
				$('.contact-form-error-name').fadeIn(100);	
			} else {
				valid = true;
				$('.contact-form-error-name').fadeOut(100);	
			}
		});
		
		$('.contact-form-input--email').on('focusout', function(ev){
			if($(this)[0].value === ''){
				valid = false;
				$('.contact-form-error-wrongemail').fadeOut(100, function(){$('.contact-form-error-email').fadeIn(100);});
			} else if($(this)[0].value != '' && !regex.test($(this)[0].value)){
				console.log('wrong');
				$('.contact-form-error-email').fadeOut(100, function(){$('.contact-form-error-wrongemail').fadeIn(100)});
			} else {
				valid = true;
				$('.contact-form-error-email').fadeOut(100);	
				$('.contact-form-error-wrongemail').fadeOut(100);	
			}
		});
		
		$('.contact-form-input--message').on('focusout', function(ev){
			if($(this)[0].value === ''){
				valid = false;
				$('.contact-form-error-message').fadeIn();	
			} else {
				valid = true;
				$('.contact-form-error-message').fadeOut();	
			}
		});
		
		$('input, textarea').on('focusin', function(){
			if ($('#form--submit').hasClass('is-done')){
				$('#form--submit').removeClass('is-done')
			} else if($('#form--submit').hasClass('is-fail')){
				$('#form--submit').removeClass('is-fail');
			}
		});
		
		// Form function 
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
	
	// When DOM is ready, show loading animation and call preinit function
	$(document).ready(function () { 
		init();
	}); 

	(onresize = function(){
		resizeCanvas();
		definegrid();
		setgridonresize();
	})();
 
	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame || 
						window.webkitRequestAnimationFrame || 
						window.mozRequestAnimationFrame || 
						window.oRequestAnimationFrame || 
						window.msRequestAnimationFrame ||
						function( callback ) { window.setTimeout(callback, 1000 / 60 ); }
	})();
	
	c.addEventListener('mousemove', function(evt) { mousePos = getMousePos(canvas, evt); });
	
	window.requestAnimFrame(drawExperiment);
	
})(jQuery);