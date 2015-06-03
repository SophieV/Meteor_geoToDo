  Template.navbar.events({
    "click .nav": function (event) {
    	$(event.target).parent().parent().find('.active').removeClass('active').css('font-weight', 'normal');
    	$(event.target).parent().addClass('active').css('font-weight', 'bold');
    }
  });