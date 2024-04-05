let currentPage = 1;
const limit = 9; // Number of ideas per page

function isUserLoggedIn() {
  const token = sessionStorage.getItem('access_token');
  return token !== null && token !== undefined; // Check if token exists
}

// // Fetch user information and update profile name
fetchUserInfo();


// Logic for login and logout buttons
const loginButton = document.querySelector('.login-btn');
const logoutButton = document.querySelector('.logout-btn');

// Check if user is logged in (you need to implement this logic)
const isLoggedIn = false; // Example: Change this to true if user is logged in

if (isUserLoggedIn()) {
    loginButton.style.display = 'none'; // Hide login button
    logoutButton.style.display = 'inline-block'; // Show logout button
} else {
    loginButton.style.display = 'inline-block'; // Show login button
    logoutButton.style.display = 'none'; // Hide logout button
    window.location.href = '/auth/login/login.html';
}

// Function to handle logout
logoutButton.addEventListener('click', () => {
    // Perform logout logic here (clear session, redirect, etc.)
    // For example, clear session storage:
    sessionStorage.clear();
    // Redirect to login page (change the URL accordingly)
    window.location.href = '/auth/login/login.html';
});

// Function to fetch user information and update profile name
function fetchUserInfo() {
  const token = getSessionToken();
  console.log("token", token);
  fetch("https://ideabox-backend.onrender.com/api/v1/ideabox/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }
      return response.json();
    })
    .then((data) => {
      const userFullNameElement = document.getElementById("userFullName");
      userFullNameElement.textContent = data.fullname;
      console.log(userFullNameElement);
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

// Function to get session token from storage
function getSessionToken() {
  return sessionStorage.getItem("access_token");
}

// Function to format the timestamp into a more readable format
function formatCreatedAt(timestamp) {
  const date = new Date(timestamp);
  // Format the date and time as desired (e.g., "April 2, 2024, 7:26 PM")
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return `${formattedDate}, ${formattedTime}`;
}

// Define a variable to store ideaIds
let ideaIds = [];

function fetchData(page) {
  const token = getSessionToken(); // Retrieve the token

  fetch(
    `https://ideabox-backend.onrender.com/api/v1/ideabox/idea/all-ideas?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      const responseData = data; // Rename data to responseData for clarity
      const formattedData = {
        ideas: responseData.data, // Extract ideas from responseData
        page: parseInt(responseData.page), // Convert page to number
        totalPages: Math.ceil(responseData.total / limit), // Calculate totalPages
      };

      // Store ideaIds from the response
      ideaIds = formattedData.ideas.map((idea) => idea.id);
      console.log(ideaIds)

      console.log("Data received:", formattedData);
      if (
        !formattedData.ideas ||
        !Array.isArray(formattedData.ideas) ||
        formattedData.ideas.length === 0
      ) {
        throw new Error("No ideas found");
      }
      renderIdeas(formattedData.ideas);
      updatePaginationButtons(formattedData.page, formattedData.totalPages);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderIdeas(ideas) {
  const dataContainer = document.getElementById("dataContainer");
  dataContainer.innerHTML = ""; // Clear previous content

  if (ideas && Array.isArray(ideas) && ideas.length > 0) {
    // Create a container for the grid
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    ideas.forEach((idea) => {
      const ideaElement = document.createElement("div");
      ideaElement.classList.add("idea");

      // Create and append tags element
      const tagsElement = document.createElement("p");
      tagsElement.classList.add("tags");
      idea.tags.split(",").forEach((tag) => {
        const tagSpan = document.createElement("span");
        tagSpan.textContent = tag.trim(); // Trim whitespace around the tag
        tagSpan.classList.add("tag");
        // Add inline style for background color
        tagSpan.style.backgroundColor = getTagColor(tag.trim().toLowerCase());
        tagSpan.style.padding = "0.3em 0.5em"; // Add padding
        tagSpan.style.marginRight = "0.5em"; // Add margin-right
        tagSpan.style.fontSize = "1.1em"; // Adjust font size
        tagSpan.style.borderRadius = "0.3em"; // Add border radius
        tagSpan.style.color = "white";
        tagSpan.style.fontWeight = 900;
        tagsElement.appendChild(tagSpan);
      });
      ideaElement.appendChild(tagsElement);

      // Create and append content element
      const contentElement = document.createElement("p");
      const maxContentLength = 200;
      if (idea.idea.length > maxContentLength) {
        const truncatedText = idea.idea.substring(0, maxContentLength) + "...";
        contentElement.textContent = truncatedText;
        ideaElement.appendChild(contentElement);

        const showMoreButton = document.createElement("button");
        showMoreButton.textContent = "Show More";
        showMoreButton.addEventListener("click", () => {
          contentElement.textContent = idea.idea;
          showMoreButton.style.display = "none";
          showLessButton.style.display = "inline-block";
        });
        ideaElement.appendChild(showMoreButton);

        const showLessButton = document.createElement("button");
        showLessButton.textContent = "Show Less";
        showLessButton.style.display = "none";
        showLessButton.addEventListener("click", () => {
          contentElement.textContent = truncatedText;
          showMoreButton.style.display = "inline-block";
          showLessButton.style.display = "none";
        });
        ideaElement.appendChild(showLessButton);
      } else {
        contentElement.textContent = idea.idea;
        ideaElement.appendChild(contentElement);
      }

      // Create and append blogger info element
      const bloggerInfo = document.createElement("p");
      bloggerInfo.textContent = `Posted by: ${idea.blogger.fullname}`;
      bloggerInfo.style.fontStyle = "italic";
      bloggerInfo.style.color = "purple";
      ideaElement.appendChild(bloggerInfo);

      // Create and append createdAt element
      const createdAtElement = document.createElement("p");
      createdAtElement.textContent = `Created At: ${formatCreatedAt(
        idea.createdAt
      )}`;
      ideaElement.appendChild(createdAtElement);

       // Create delete button and attach idea ID
       const deleteButton = createDeleteButton(idea.id);
       ideaElement.appendChild(deleteButton);

      // Append the idea element to the grid container
      gridContainer.appendChild(ideaElement);
    });

    // Append the grid container to the data container
    dataContainer.appendChild(gridContainer);
  } else {
    // If no ideas found, display a message
    dataContainer.textContent = "No ideas found.";
  }
}

function createDeleteButton(ideaId) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '<img width="24" height="24" src="https://img.icons8.com/color/48/000000/cancel--v1.png" alt="cancel--v1"/>';
  deleteButton.dataset.ideaId = ideaId; // Store the ideaId as a data attribute
  deleteButton.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to delete this idea?');
    if (confirmed){
      const ideaId = deleteButton.dataset.ideaId; // Retrieve the ideaId from the data attribute
      await deleteIdea(ideaId);
      deleteButton.parentElement.remove()

    }
   
  });
  return deleteButton;
}

// Function to delete an idea
async function deleteIdea(ideaId) {
  const token = getSessionToken();
  const userId = getUserIdFromToken(token);

  try {
    const response = await fetch(`https://ideabox-backend.onrender.com/api/v1/ideabox/idea/delete-idea/${ideaId}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      // Optionally handle successful deletion
      console.log('Idea deleted successfully');
    } else {
      // Handle error response
      const errorData = await response.json();
      console.error('Error deleting idea:', errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while deleting the idea.');
  }
}
// Function to get tag color based on the tag value
function getTagColor(tag) {
  switch (tag.toUpperCase()) {
    case "BUSINESS":
      return "teal";
    case "INVENTIONS":
      return "orange";
    case "TECHNOLOGY":
      return "green";
    case "EDUCATION":
      return "#42e0d1";
    case "ARTIFICIAL_INTELLIGENCE":
      return "purple";
    case "SOFTWARE":
      return "pink";
    default:
      return "gray";
  }
}

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

function updatePaginationButtons(currentPage, totalPages) {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;

  prevPageButton.addEventListener("click", () => {
    fetchData(currentPage - 1);
  });

  nextPageButton.addEventListener("click", () => {
    fetchData(currentPage + 1);
  });
}

// // Initial fetch
fetchData(currentPage);
