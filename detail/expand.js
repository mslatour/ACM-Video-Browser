jQuery(document).ready(function() {

//CLICK ON YEAR TO EXPAND
 $(document).ready(function() {
   $('#access li').click(function() {
	var index = $(this).index();
	//$("#example_index").html("Index " + index + " was clicked");
	if ( $('#test li:eq(' + index + ')').width() == 1200 )
	{
	$('#test li:eq(' + index + ')').animate({'width': '300px'});
	$(this).animate({'width': '300px'})
		$('#test li .details').hide();
	}
	else
	{
	$('#test li:eq(' + index + ')').animate({'width': '1200px'}, "slow").siblings().animate({'width':'300px'});
	$(this).animate({'width': '1200px'}).siblings().animate({'width':'300px'});
	$('#test li:eq(' + index + ') .details').show();
	}
   });
 });

//CLICK ON YEAR TO SCROLL TO THAT YEAR
$(document).ready(function() {
	$('#access li').bind('click',function(event){
	var $anchor = $(this);
	$('html, body').stop().animate({scrollLeft: $($anchor.attr('a href')).position().left}, 1000);
	event.preventDefault();
	});
});

//CODE TO MAKE TIMELINE SCROLLABLE
    $(document).ready(function () {        
        $('#timeline').mousedown(function (event) {
            $(this)
                .data('down', true)
                .data('x', event.clientX)
                .data('scrollLeft', this.scrollLeft);
                
            return false;
        }).mouseup(function (event) {
            $(this).data('down', false);
        }).mousemove(function (event) {
            if ($(this).data('down') == true) {
                this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
            }
        }).mousewheel(function (event, delta) {
            this.scrollLeft -= (delta * 30);
        }).css({
            'overflow' : 'hidden',
            'cursor' : '-moz-grab'
        });
    });
    
    $(window).mouseout(function (event) {
        if ($('#timeline').data('down')) {
            try {
                if (event.originalTarget.nodeName == 'BODY' || event.originalTarget.nodeName == 'HTML') {
                    $('#timeline').data('down', false);
                }                
            } catch (e) {}
        }
    });

});

//CODE TO MAKE NAVIGATION ARROWS WORK
$(document).ready(function(){
	var slides = $('#timeline ul li');
	var slideAantal = slides.length;
	var slideBreedte = 300;
	var slideHuidig = 0;

	// Zorg ervoor dat de totale breedte van #slide overeenkomt met de breedte van het aantal slides
	//$('#timeline ul').css('width', slideAantal * slideBreedte);

	// Functie welke wordt aangeroepen wanneer er op de vorige/volgende knoppen wordt gedrukt
	$('.navigation span').click(function() {
		// Als op de knop 'volgende' is gedrukt...
		if ($(this).attr('id') == 'next') {
			// ...naar de volgende slide gaan...
			slideHuidig = slideHuidig + 1;
		}
		// ...en wanneer op de 'vorige' knop is gedrukt...
		else {
			// ...naar de vorige slide gaan
			slideHuidig = slideHuidig - 1;
		}

		// Zorg er weer voor dat de vorige/volgende knoppen goed worden weergegeven
		navigatie(slideHuidig);

		// Verschuif #slides door middel van de linker margin
		$('#timeline ul').animate({
			'marginLeft' : (-slideHuidig * slideBreedte)
		});
	});

	// Functie die ervoor zorgt dat de vorige/volgende knoppen op de juiste momenten worden weergegeven
	function navigatie(slideHuidig) {
		// Bij de laatste slide de 'volgende' knop weglaten..
		if (slideAantal - 1 == slideHuidig) {
			$('#next').hide()
		} //...of laten zien wanneer het niet de laatste slide is
		else {
			$('#next').show()
		}

		// Bij de eerste slide de 'vorige' knop weglaten..
		if (slideHuidig == 0) {
			$('#previous').hide()
		} //...of laten zien wanneer het niet de eerste slide is
		else {
			$('#previous').show()
		}
	}

	// Zorg ervoor dat de 'vorige' knop wordt weggelaten wanneer de pagina wordt geladen
	navigatie(slideHuidig);
});

