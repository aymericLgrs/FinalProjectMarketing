// Waits for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page chargée. Initialisation...");
  
    const carousel = document.querySelector('.carousel'); // Selects the carousel container
    const filmDescription = document.getElementById('film-description'); // Element for displaying film descriptions
    const filmGenreSelectionne = document.getElementById('film-genre-selectionne'); // Element for displaying the selected film genre
  
    // Retrieves the selected genres from localStorage or defaults to an empty array
    const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres')) || [];
    console.log("Genres sélectionnés :", selectedGenres);
  
    // Redirects to the genres page if the selection is invalid
    if (selectedGenres.length !== 7) {
        console.error("Sélection de genres incorrecte. Redirection vers la page des genres.");
        window.location.href = 'genres.html';
        return;
    }
  
    // Fetches the movie data from a CSV file
    fetch('products.csv')
        .then(response => {
            console.log("Réponse fetch reçue.");
            return response.text(); // Converts the response to text
        })
        .then(csvData => {
            console.log("Données CSV chargées.");
            const rows = csvData.split('\n').slice(1); // Splits the data into rows and removes the header
            const genres = {}; // Object to organize movies by genre
  
            // Parses each row of the CSV file
            rows.forEach((row, index) => {
                const [movie_id, title, genreString, poster_id] = row.split(';');
                if (!movie_id || !title || !genreString || !poster_id) {
                    console.warn(`Ligne ignorée (${index + 1}) : données manquantes.`);
                    return; // Skips rows with missing data
                }
  
                // Splits the genres and organizes movies into the `genres` object
                genreString.split('|').forEach(genre => {
                    if (!genres[genre]) genres[genre] = [];
                    genres[genre].push({ title: title.trim(), poster_id: poster_id.trim() });
                });
            });
  
            console.log("Genres et films après parsing :", genres);
  
            // Adds movies to the carousel for each selected genre
            selectedGenres.forEach(genre => {
                if (!genres[genre] || genres[genre].length === 0) {
                    console.warn(`Aucun film trouvé pour le genre : ${genre}`);
                    return;
                }
  
                // Selects a random movie from the genre
                const randomMovie = genres[genre][Math.floor(Math.random() * genres[genre].length)];
                console.log(`Film sélectionné pour ${genre} :`, randomMovie);
  
                // Creates a carousel item for the movie
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                carouselItem.dataset.key = genre; // Stores the genre in a dataset attribute
                carouselItem.dataset.description = randomMovie.title; // Stores the movie title
                carouselItem.style.backgroundImage = `url('static/${randomMovie.poster_id}.jpg')`; // Sets the background image
                carouselItem.innerHTML = `<div class="text">${randomMovie.title}</div>`;
                carousel.appendChild(carouselItem); // Appends the item to the carousel
            });
  
            // Adds event listeners to each carousel item
            document.querySelectorAll('.carousel-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const genre = item.dataset.key.toLowerCase();
                    document.body.className = `${genre}-background`; // Changes the body background based on the genre
                    filmGenreSelectionne.textContent = `Film Genre: ${item.dataset.key}`;
                    filmDescription.textContent = item.dataset.description;
                });
  
                item.addEventListener('mouseleave', () => {
                    document.body.className = ''; // Resets the background
                    filmDescription.textContent = 'Hover to discover your movie';
                });
  
                item.addEventListener('click', () => {
                    item.classList.add('watched'); // Marks the movie as watched
                    console.log(`Film marqué comme vu : ${item.dataset.description}`);
                });
            });
  
            // Hides the loading screen and displays the main content
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        })
        .catch(error => {
            console.error("Erreur lors du chargement des films :", error); // Logs errors
            document.getElementById('loading-screen').textContent = 'Erreur de chargement.';
        });
  });
  
  // Adds functionality to the back button
  document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'genres.html'; // Redirects to the genres page
        });
    }
  });
  
  // Adds functionality to profile selection buttons
  document.addEventListener('DOMContentLoaded', () => {
    const profileButtons = document.querySelectorAll('.select-button');
    profileButtons.forEach(button => {
        button.addEventListener('click', () => {
            const profile = button.dataset.profile; // Gets the selected profile
  
            // Saves the selected profile to localStorage
            localStorage.setItem('selectedProfile', profile);
  
            // Redirects to the genres page
            window.location.href = 'genres.html';
        });
    });
  });