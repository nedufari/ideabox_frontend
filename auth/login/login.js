document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const errorContainer = document.getElementById("errorContainer");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the email and password from the form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    


    // Send a POST request to your backend API to authenticate the user
    fetch("https://ideabox-backend.onrender.com/api/v1/ideabox/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        return response.json();
      })
      .then((data) => {
        // Successful login
        // Save the token in session storage
      
        console.log('extracted_token',data.token)
        sessionStorage.setItem("access_token", data.token);

        // Redirect the user to the homepage or any other page
        window.location.href = "/index.html";
      })
      .catch((error) => {
        // Display error message to the user
        errorContainer.textContent =
          "Failed to login. Please check your credentials.";
        console.error("Error logging in:", error);
      });
  });
});
