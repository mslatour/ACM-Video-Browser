jQuery(document).ready(function() {

//CLICK ON YEAR TO EXPAND
 $(document).ready(function() {
   $('#access li').click(function() {
     //alert("Hello world!");
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

//CLICK ON VIDEO FOR RELATED VIDEOS
 $(document).ready(function() {
   $('#test li a').click(function() {
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
