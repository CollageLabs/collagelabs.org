// Validate the field
window.hasErrorContactForm = function (field) {

  // Don't validate submits, buttons, file and reset inputs, and disabled fields
  if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

  // Get validity
  var validity = field.validity;

  // If valid, return null
  if (validity.valid) return;

  // If field is required and empty
  if (validity.valueMissing) return 'Please fill out this field.';

  // If not the right type
  if (validity.typeMismatch) {

    // Email
    if (field.type === 'email') return 'Please enter an email address.';

    // URL
    if (field.type === 'url') return 'Please enter a URL.';

  }

  // If too short
  if (validity.tooShort) return 'Please lengthen this text to ' + field.getAttribute('minLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';

  // If too long
  if (validity.tooLong) return 'Please shorten this text to no more than ' + field.getAttribute('maxLength') + ' characters. You are currently using ' + field.value.length + ' characters.';

  // If pattern doesn't match
  if (validity.patternMismatch) {

    // If pattern info is included, return custom error
    if (field.hasAttribute('title')) return field.getAttribute('title');

    // Otherwise, generic error
    return 'Please match the requested format.';

  }

  // If number input isn't a number
  if (validity.badInput) return 'Please enter a number.';

  // If a number value doesn't match the step interval
  if (validity.stepMismatch) return 'Please select a valid value.';

  // If a number field is over the max
  if (validity.rangeOverflow) return 'Please select a value that is no more than ' + field.getAttribute('max') + '.';

  // If a number field is below the min
  if (validity.rangeUnderflow) return 'Please select a value that is no less than ' + field.getAttribute('min') + '.';

  // If all else fails, return a generic catchall error
  return 'The value you entered for this field is invalid.';

}

// Show an error message
window.showErrorContactForm = function (field, error) {

  // Add error class to field
  field.classList.add('error');
  
  // If the field is a radio button and part of a group, error all and get the last item in the group
  if (field.type === 'radio' && field.name) {
    var group = field.form.querySelectorAll('[name="' + field.name + '"]');
    if (group.length > 0) {
      for (var i = 0; i < group.length; i++) {
        group[i].classList.add('error');
      }
      field = group[group.length - 1];
    }
  }

  // Get field id or name
  var id = field.id || field.name;
  if (!id) return;

  // Check if error message field already exists
  // If not, create one
  var message = field.form.querySelector('.error-message#error-for-' + id );
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = 'error-for-' + id;
    
    // If the field is a radio button or checkbox, insert error after the label
    var label;
    if (field.type === 'radio' || field.type ==='checkbox') {
      label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
      if (label) {
        label.parentNode.insertBefore( message, label.nextSibling );
      }
    }

    // Otherwise, insert it after the field
    if (!label) {
      field.parentNode.insertBefore( message, field.nextSibling );
    }

  }
  
  // Add ARIA role to the field
  field.setAttribute('aria-describedby', 'error-for-' + id);

  // Update error message
  message.innerHTML = error;

  // Show error message
  message.style.display = 'block';
  message.style.visibility = 'visible';

}

// Show an error message
window.showErrorCaptcha = function () {

  var id = 're-captcha';
  var field = document.getElementById(id);

  // Add error class to field
  field.classList.add('error');

  // Check if error message field already exists
  // If not, create one
  var message = document.querySelector('.error-message#error-for-' + id );
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = 'error-for-' + id;
    field.parentNode.insertBefore(message, field.nextSibling);
  }

  // Add ARIA role to the field
  field.setAttribute('aria-describedby', 'error-for-' + id);

  // Update error message
  message.innerHTML = 'Please validate the captcha.';
  message.style.display = 'block';
  message.style.visibility = 'visible';

}

// Remove the error message
window.removeErrorContactForm = function (field) {

  // Remove error class to field
  field.classList.remove('error');
  
  // Remove ARIA role from the field
  field.removeAttribute('aria-describedby');

  // If the field is a radio button and part of a group, remove error from all and get the last item in the group
  if (field.type === 'radio' && field.name) {
    var group = field.form.querySelectorAll('[name="' + field.name + '"]');
    if (group.length > 0) {
      for (var i = 0; i < group.length; i++) {
        group[i].classList.remove('error');
      }
      field = group[group.length - 1];
    }
  }

  // Get field id or name
  var id = field.id || field.name;
  if (!id) return;

  // Check if an error message is in the DOM
  var message = field.form.querySelector('.error-message#error-for-' + id + '');
  if (!message) return;

  // If so, hide it
  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';

}

// Remove the error message
window.removeErrorCaptcha = function () {

  var id = 're-captcha';
  var field = document.getElementById(id);

  // Remove error class to field
  field.classList.remove('error');
  
  // Remove ARIA role from the field
  field.removeAttribute('aria-describedby');

  // Check if an error message is in the DOM
  var message = document.querySelector('.error-message#error-for-' + id + '');
  if (!message) return;

  // If so, hide it
  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';

}

// Display the form status
window.displayContactFormStatus = function (data) {
  // Get the status message content area
  var mcStatus = document.querySelector('.mc-status');
  var spinner = document.querySelector('.waiting .loader');
  var button = document.querySelector('.suscribe');

  if (!mcStatus) return;

  // Update our status message
  mcStatus.innerHTML = data.msg;

  // If error, add error class
  if (data.result === 'error') {
    mcStatus.classList.remove('success-message');
    mcStatus.classList.add('error-message');
    return;
  }

  // Otherwise, add success class
  mcStatus.classList.remove('error-message');
  mcStatus.classList.add('success-message');

  spinner.style.display = 'none';
  spinner.style.visibility = 'hidden';

  button.disabled = false;
  button.innerHTML = 'Send';

}

window.serializeObject = function (dictionary) {
  return Object.keys(dictionary).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(dictionary[key])
  }).join('&');
}

// Submit the form
window.submitContactForm = function (form) {

  // Get the Submit URL
  var url = form.getAttribute('action');
  var email = document.getElementById('contact-email').value;
  var name = document.getElementById('contact-name').value;
  var message = document.getElementById('contact-message').value;
  var botField = document.getElementsByName('bot-field').value || '';
  var formName = document.getElementsByName('form-name').value || 'contact-form';
  var spinner = document.querySelector('.waiting .loader');
  var button = document.querySelector('.suscribe');
  var fetchOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: serializeObject({
      'contact-email': email,
      'contact-name': name,
      'contact-message': message,
      'bot-field': botField,
      'form-name': formName,
      'recaptcha-state': window.recaptchaState
    }),
  };

  spinner.style.display = 'block';
  spinner.style.visibility = 'visible';

  button.disabled = true;
  button.innerHTML = 'Sending';

  // Create a global variable for the status container
  window.mcStatus = form.querySelector('.mc-status');

  if (window.location.host != 'localhost:5000' &&
      window.location.host != '127.0.0.1:5000') {
    fetch('/', fetchOptions);
  }

  fetch(url, fetchOptions).then(function(response) {
    return response.json();
  }).then(function(data) {
    displayContactFormStatus(data);
  });

}
