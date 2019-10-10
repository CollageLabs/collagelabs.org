(function($){
  $(function($){
    
    $(document).scroll(function(){
      const navbar = $('#navbar');
      navbar.toggleClass('scrolled', $(this).scrollTop() > navbar.height());
    });
    
    $('a[href*="#"]').on('click', function(e){
      e.preventDefault();
      $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top - 50
      }, 500);
      return false;
    });

    $('.multiple-items').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    

  });
}(window.jQuery));
