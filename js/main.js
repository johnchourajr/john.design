// ---------------
// Header Click
// ---------------
$('#designer').on('click', function(evt) {

  var designer = $('.designer');
  var multi = $('.multi');

  if (designer.hasClass('active')) {
    designer.addClass('inactive').removeClass('active');
    multi.addClass('active').removeClass('inactive');
  } else {
    designer.addClass('active').removeClass('inactive');
    multi.addClass('inactive').removeClass('active');
  }
});


// ---------------
// Animated scroll
// ---------------
$('a[href*=#]:not([href=#])').click(function() {
  if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {

    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 400);
      return false;
    }
  }
});


// ---------------
// Scroll Mod
// ---------------
function Parallax() {
  var scrollPos = $(this).scrollTop();

  $('.shape--sheet-1').css({
    'margin-top' : (-1-(scrollPos / 9))
  });

  $('.shape--sheet-2').css({
    'margin-top' : (-1-(scrollPos / 15))
  });

  $('.shape--sheet-3').css({
    'margin-top' : (-1-(scrollPos / 6))
  });

}
$(document).ready(function(){
  $(window).scroll(function() {
    Parallax();
  });
});
