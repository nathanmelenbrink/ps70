// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function()
{
	// Image hover
	$(".thumbnail-img").hover(function() {
		$(this).find(".thumbnail-hover").stop(true, true).fadeIn(200);
	}, function() {
		$(this).find(".thumbnail-hover").fadeOut(400);
	});
	
	$(".thumbnail-img").click(function() {
		$(this).find(".thumbnail-hover").fadeOut(400);
	});
	
	// Hide hover effect on touch devices
	if (Modernizr.touch) {
		$(".thumbnail-hover").css("display", "none");
		$(".thumbnail-hover").css("visibility", "hidden");
		$(".thumbnail-img").unbind("mouseenter mouseleave");
	}
	
	// Trigger caption hover on thumbnail hover
	$(".thumbnail-img").hover(function(){
		$(this).parent().find(".caption-link").toggleClass("caption-hover");
	});
	
	// Trigger thumbnail hover on caption hover
	$(".caption-link").hover(function() {
		$(this).parent().parent().find(".thumbnail-hover").stop(true, true).fadeIn(200);
	}, function() {
		$(this).parent().parent().find(".thumbnail-hover").fadeOut(400);
	});
	
	// Back to top button on detail view page
	$(".back-to-top").click(function(event) {
		event.preventDefault();
		$("html, body").animate({scrollTop: 0}, 700);
	});
	
});