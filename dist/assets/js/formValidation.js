const submitButton = document.querySelector('#submitButton');

const validate = (e) => {

    const errorMessages =  document.querySelectorAll('.error');

    errorMessages.forEach(errorMessage => { 
        errorMessage.classList.add('hide');
    });

    const formFields = document.querySelectorAll('input:not([type=hidden]), textarea:not([id^="h-captcha-response"])');

    formFields.forEach(field => {
        if (!field.value) {
            e.preventDefault();
            field.nextElementSibling.classList.remove('hide');
            field.focus();
            return false;
        }
    });

    function showError() {

    }

    const emailAddress = document.querySelector('#email');

    if (!emailIsValid(emailAddress.value)) {
        e.preventDefault();
        if (emailAddress.nextElementSibling.classList.contains('hide')) {
            emailAddress.nextElementSibling.classList.remove('hide');
            emailAddress.focus();
            return false;
        }
    }

    const hCaptcha = document.querySelector('textarea[name=h-captcha-response]');

    if (!hCaptcha.value) {
        document.querySelector('.error--hcaptcha').classList.remove('hide');
    }

    console.log('is it getting down here?')

    return true;
}

const emailIsValid = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

submitButton.addEventListener('click', validate);
