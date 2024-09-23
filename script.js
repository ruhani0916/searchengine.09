document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const historyList = document.getElementById('historyList');
    const resultsList = document.getElementById('resultsList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    const imageList = document.getElementById('imageList'); // New image list element

    const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API Key

    // Load search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Display search history
    function displaySearchHistory() {
        historyList.innerHTML = "";
        searchHistory.forEach((term, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = term;
            historyList.appendChild(listItem);
        });
    }

    // Update localStorage and display
    function updateSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }

    // Fetch search results from OpenWeather API
    async function fetchSearchResults(query) {
        resultsList.innerHTML = ""; // Clear previous results
        imageList.innerHTML = ""; // Clear previous images
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod === 200) {
                displaySearchResults(data);
            } else {
                resultsList.innerHTML = `<p>No results found for "${query}".</p>`;
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            resultsList.innerHTML = `<p>Error fetching results. Please try again.</p>`;
        }
    }

    // Display search results and add images
    function displaySearchResults(data) {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h3>${data.name} (${data.sys.country})</h3>
            <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
        resultsList.appendChild(resultItem);

        // Display weather icon image
        const weatherIcon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        const imageItem = document.createElement('img');
        imageItem.src = iconUrl;
        imageList.appendChild(imageItem);
    }

    // Add search term to history and fetch results
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchHistory.push(searchTerm);
            updateSearchHistory();
            fetchSearchResults(searchTerm);
            searchInput.value = ""; // Clear input after search
        }
    });

    // Clear search history
    clearHistoryButton.addEventListener('click', () => {
        searchHistory = [];
        updateSearchHistory();
        resultsList.innerHTML = ""; // Clear results
        imageList.innerHTML = ""; // Clear images
    });

    // Initialize display
    displaySearchHistory();
});
