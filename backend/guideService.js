// guideService.js

// Function to fetch guide data from the backend
export function fetchGuides() {
    const apiUrl = 'http://localhost:3000/api/guides';
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching guide data:', error);
        throw error; // Rethrow the error to handle it in the calling code
      });
  }
  
  // Function to display guide data on the frontend
  export function displayGuides() {
    const guideList = document.getElementById('guide-list');
    const loadingIndicator = document.getElementById('loading-indicator');
  
    loadingIndicator.style.display = 'block'; // Show loading indicator
  
    fetchGuides()
      .then(guides => {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
  
        // Display guide data
        guides.forEach(guide => {
            const listItem = document.createElement('li');
            const availabilityText = guide.availability ? "Available" : "Not Available";
            listItem.textContent = `${guide.name} - ${guide.location} - ${availabilityText} - Price: $${guide.price}`;
            guideList.appendChild(listItem);
        });
        
      })
      .catch(error => {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
  
        // Display error message to the user
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to fetch guide data. Please try again later.';
        guideList.appendChild(errorMessage);
      });
  }
  