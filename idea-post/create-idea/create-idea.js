document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const errorContainer = document.getElementById("errorContainer");

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const tags = document.getElementById("tags").value;

    const formData = new FormData();
    formData.append("idea", name);
    formData.append("tag", tags);
    // Append any other form fields or files if needed

    const token = sessionStorage.getItem("access_token"); // Get the authentication token from localStorage
    
    try {
      const userId = getUserIdFromToken(token); // Extract the user ID from the token
      
      const response = await fetch(`https://ideabox-backend.onrender.com/api/v1/ideabox/idea/create-idea/${userId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create idea");
      }

      const data = await response.json();

      alert('idea created  successfully!.');
      // Handle successful sign-up, e.g., redirect to the verify email page
      window.location.href = '/index.html';
      console.log("Idea created successfully:", data);
      // Optionally, redirect to another page or display a success message
    } catch (error) {
      console.error("Error creating idea:", error.message);
      errorContainer.textContent = "Error: " + error.message;
    }
  });
});

function getUserIdFromToken(token) {
  if (!token) {
      throw new Error("Token is missing");
  }

  // Split the token into its three parts: header, payload, and signature
  const tokenParts = token.split(".");
  
  // Decode the payload, which is the second part of the token
  const encodedPayload = tokenParts[1];
  const decodedPayload = atob(encodedPayload);
  console.log("Decoded Payload:", decodedPayload); // Log the decoded payload
    
  
  // Parse the payload as JSON
  const payload = JSON.parse(decodedPayload);
  
  // Retrieve the userId from the payload
  const userId = payload.sub;
  

  if (!userId) {
      throw new Error("User ID not found in token");
  }

  return userId;
}
