async function deleteIdea(ideaId, cardId) {
    const token = getSessionToken();
    userId = getUserIdFromToken(token);
  
    try {
      // Fetch the idea by its ID to ensure correctness
      const fetchedIdeaResponse = await fetch(
        `http://localhost:3000/api/v1/ideabox/idea/one-idea/${ideaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!fetchedIdeaResponse.ok) {
        throw new Error("Failed to fetch idea");
      }
  
      const fetchedIdea = await fetchedIdeaResponse.json();
      console.log("ideas", fetchedIdea);
  
      // Check if fetchedIdea is valid before proceeding
      if (!fetchedIdea) {
        throw new Error("Failed to fetch idea details");
      }
      ideaId = fetchedIdea.id;
      userId = getUserIdFromToken();
  
      // Now you have the ideaId, proceed with deleting the idea
      const response = await fetch(
        `http://localhost:3000/api/v1/ideabox/idea/delete-idea/${ideaId}/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete idea");
      }
  
      // Remove the card from the DOM
      const cardToRemove = document.getElementById(cardId);
      if (cardToRemove) {
        cardToRemove.remove();
        console.log("Card removed successfully.");
      } else {
        console.log("Card not found in the DOM.");
      }
  
      const data = await response.json();
      console.log("Idea deleted successfully:", data);
      // Optionally, you can update the UI or show a success message
    } catch (error) {
      console.error("Error deleting idea:", error.message);
      // Handle error (e.g., display error message)
    }
  }



function confirmDeleteIdea(ideaId, cardId, token) {
    const confirmation = confirm("Are you sure you want to delete this idea?");
    if (confirmation) {
      deleteIdea(ideaId, cardId, token); // Pass only ideaId and cardId
    }
  }

  const token = getSessionToken();
  console.log("token recieved",token)
  if (token) {
    // Check if token is retrieved successfully
    deleteButton.dataset.token = token;
  } else {
    console.log("no token was recieved ")
    // Handle the case where no token is found (e.g., display an error message)
  }