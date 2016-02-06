// HAMBURGUER COLLAPSE
$(window).resize(function() {
  if ($(window).width() < 700) {
    $('#col-collapse').addClass('hidden');
    $('#col-collapse').removeClass('shown');
    $('#index-col').addClass('col-xs-2');
    $('#index-col').removeClass('col-xs-4');
  }
  if ($(window).width() > 700) {
    $('#col-collapse').removeClass('hidden');
    $('#col-collapse').addClass('shown');
    $('#index-col').removeClass('col-xs-2');
    $('#index-col').addClass('col-xs-4');
  }
})

$(document).on("click", "#hamb-btn-show", function() {
  $('#col-collapse').toggle('slow', function() {
    $('#col-collapse').toggleClass('hidden', 'shown');
  });
    $('#index-col').toggleClass('col-xs-4', '');
    $('#index-col').toggleClass('col-xs-2', '');
})
