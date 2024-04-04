document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value; 

    try {
        const response = await fetch('http://localhost:3000/api/v1/ideabox/user/reset-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                otp, 
                password,
                confirmPassword
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Password reset successfully done! Now you can login.');
            window.location.href = '../login/login.html';
        } else {
            const errorData = await response.json();
            handleErrors(errorData);
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        // Handle non-JSON error responses here
    }
});

function handleErrors(errors) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = ''; // Clear previous errors

    if (Array.isArray(errors.errors)) {
        for (const error of errors.errors) {
            const errorElement = document.createElement('p');
            errorElement.textContent = error.message;
            errorElement.style.color = 'red';
            errorContainer.appendChild(errorElement);
        }
    } else if (errors.message) {
        const errorElement = document.createElement('p');
        errorElement.textContent = errors.message;
        errorElement.style.color = 'red';
        errorContainer.appendChild(errorElement);
    }
}
         