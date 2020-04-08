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

    // Add the novalidate attribute when the JS loads
    var forms = document.querySelectorAll('.validate');
    for (var i = 0; i < forms.length; i++) {
      forms[i].setAttribute('novalidate', true);
    }

    // Listen to all blur events
    document.addEventListener('blur', function (event) {
      // Only run if the field is in a form to be validated
      if (!('tagName' in event.target)) return;
      if (event.target.tagName.toUpperCase() != 'INPUT' ||
          event.target.tagName.toUpperCase() != 'TEXTAREA' ||
          !event.target.form.classList.contains('validate')) return;

      // Validate the field
      var error = hasErrorContactForm(event.target);

      // If there's an error, show it
      if (error) {
        showErrorContactForm(event.target, error);
        return;
      }

      // Otherwise, remove any existing error message
      removeErrorContactForm(event.target);

    }, true);

    // Check all fields on submit
    document.addEventListener('submit', function (event) {

      // Only run on forms flagged for validation
      if (!event.target.classList.contains('validate')) return;

      // Prevent form from submitting
      event.preventDefault();

      // Get all of the form elements
      var fields = event.target.elements;
      var recaptchaState = grecaptcha.getResponse();

      // Validate each field
      // Store the first field with an error to a variable so we can bring it into focus later
      var error, hasErrors;
      for (var i = 0; i < fields.length; i++) {
        error = hasErrorContactForm(fields[i]);
        if (error) {
          showErrorContactForm(fields[i], error);
          if (!hasErrors) {
            hasErrors = fields[i];
          }
        }
      }

      if (recaptchaState.length == 0) {
        showErrorCaptcha();
      }

      if (hasErrors || recaptchaState.length == 0) {
        // If there are errrors, don't submit form and focus on first element with error
        hasErrors.focus();
      } else {
        // Otherwise, let the form submit normally
        submitContactForm(event.target);
      }

    }, false);

  });
}(window.jQuery));
