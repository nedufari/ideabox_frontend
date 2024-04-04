document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
   
    const email = document.getElementById('email').value;


    try {
        // Use Fetch API or any other method to send data to your backend
        const response = await fetch('http://localhost:3000/api/v1/ideabox/user/send-password-reset-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            // Update the UI to show a success message or redirect the user
            alert('password reset OTP requested! Please check your email for verification.');
            // Handle successful sign-up, e.g., redirect to the verify email page
            window.location.href = "../finally-reset-password/finally-reset-password.html";
        } else {
            // Handle failed sign-up
            const errorData = await response.json();
            handleErrors(errorData);
        }
    } catch (error) {
        console.error('Error during requesting OTP for password reset:', error);
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
        // If errors.errors is not an array, display a single error message
        const errorElement = document.createElement('p');
        errorElement.textContent = errors.message;
        errorElement.style.color = 'red';
        errorContainer.appendChild(errorElement);
    }
}
