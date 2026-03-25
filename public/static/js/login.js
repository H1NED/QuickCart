document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelector('.login-boxes');
    const signinBtn = document.querySelector('.login-swipe__btn--toSignin');
    const signupBtn = document.querySelector('.login-swipe__btn--toSignup');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const signinError = document.querySelector('.signin-error');
    const signinErrorMessage = document.querySelector('.signin-error__message');
    const signupError = document.querySelector('.signup-error');
    const signupErrorMessage = document.querySelector('.signup-error__message');

    signinBtn.addEventListener('click', function(){
        toggleForms('signin');
    });
    signupBtn.addEventListener('click', function(){
        toggleForms('signup');
    });

    signinForm.addEventListener('submit', handleFormSubmit);
    signupForm.addEventListener('submit', handleFormSubmit);

    function toggleForms(formType) {
        forms.style.transform = formType === 'signup' ? 'translate(-60%, 0)' : 'translate(0%, 0)';
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formType = event.target.id === 'signinForm' ? 'signin' : 'signup';

        authenticateUser(formType, formData);
    }

    function authenticateUser(formType, formData) {
        const endpoint = formType === 'signin' ? '/user/signin' : '/user/signup';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then(response => response.json())
        .then(data => handleAuthenticationResponse(data, formType))
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    function handleAuthenticationResponse(data, formType) {

        const errorElement = formType === 'signin' ? signinError : signupError;
        const errorMessageElement = formType === 'signin' ? signinErrorMessage : signupErrorMessage;

        if (data.status === 'SUCCESS' && data) {
            const userName = data.data.username;
            saveUserInfo(data);
            saveUserName(userName);
            console.log(userName);
            window.location.href = document.referrer;
        } else {
            errorElement.style.display = 'block';
            errorMessageElement.innerHTML = data.message;
        }
    }

    function saveUserInfo(user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
    }

    function saveUserName(userName) {
        localStorage.setItem('userName', userName);
    }
});