document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const gender =document.getElementById('gender').value

    try {
        // Use Fetch API or any other method to send data to your backend
        const response = await fetch('http://localhost:3000/api/v1/ideabox/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname,
                email,
                password,
                gender
            }),
        });

        if (response.ok) {
            const result = await response.json();
            // Update the UI to show a success message or redirect the user
            alert('Signup successful! Please check your email for verification.');
            // Handle successful sign-up, e.g., redirect to the verify email page
            window.location.href = '../login/login.html';
        } else {
            // Handle failed sign-up
            const errorData = await response.json();
            handleErrors(errorData);
        }
    } catch (error) {
        console.error('Error during sign-up:', error);
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
