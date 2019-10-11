(function($){
  $(function($){
    
    $(document).scroll(function(){
      const navbar = $('#navbar');
      navbar.toggleClass('scrolled', $(this).scrollTop() > navbar.height());
    });
    
    $('a[href*="#"]').on('click', function(e){
      e.preventDefault();
      $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top
      }, 500);
      return false;
    });

  });
}(window.jQuery));
