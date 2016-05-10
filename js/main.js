
// ---------------
// smoothState Init
// ---------------

// $(function() {
//   'use strict';
//   $('.doc').smoothState({ debug: true, prefetch: true, cacheLength: 2, scroll: true, });
// });

$(function(){
  'use strict';
  var $page = $('#doc'),
      options = {
        debug: true,
        prefetch: true,
        cacheLength: 2,
        onStart: {
          duration: 250, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            $container.addClass('is-exiting');
            // Restart your animation
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            $container.removeClass('is-exiting');
            // Inject the new content
            $container.html($newContent);
          }
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');
});

// ---------------
// Ext. Link Click
// ---------------
$(document.links).filter(function() {
  return this.hostname != window.location.hostname;
}).attr('target', '_blank');

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
