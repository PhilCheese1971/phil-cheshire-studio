const submitButton = document.querySelector('#submitButton');

const validate = (event) => {

    const errorMessages =  document.querySelectorAll('.error');

    errorMessages.forEach(errorMessage => { 
        errorMessage.classList.add('hide');
    });

    const formFields = document.querySelectorAll('input:not([type=hidden]), textarea:not([id^="h-captcha-response"])');

    formFields.forEach(field => {
        if (!field.value) {
            showError(field, field.nextElementSibling);
        }
    });

    function showError(field, fieldError) {
        preventSubmission(event.defaultPrevented);
        fieldError.classList.remove('hide');
        field.focus();
        return false;
    }

    function preventSubmission(previouslyPrevented) {
        if (!previouslyPrevented) {
            event.preventDefault();
        }
    }

    const emailAddress = document.querySelector('#email');

    if (!emailIsValid(emailAddress.value)) {
        showError(emailAddress, emailAddress.nextElementSibling);
    }

    const hCaptcha = document.querySelector('textarea[name=h-captcha-response]');

    if (!hCaptcha.value) {
        showError(hCaptcha, document.querySelector('.error--hcaptcha'));
    }

    return true;
}

const emailIsValid = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

submitButton.addEventListener('click', validate);
