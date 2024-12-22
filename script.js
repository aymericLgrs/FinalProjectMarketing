document.addEventListener('DOMContentLoaded', () => {
  console.log("Page chargée. Initialisation...");

  const carousel = document.querySelector('.carousel');
  const filmDescription = document.getElementById('film-description');
  const filmGenreSelectionne = document.getElementById('film-genre-selectionne');

  // Récupérer les genres sélectionnés
  const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres')) || [];
  console.log("Genres sélectionnés :", selectedGenres);

  if (selectedGenres.length !== 7) {
      console.error("Sélection de genres incorrecte. Redirection vers la page des genres.");
      window.location.href = 'genres.html';
      return;
  }

  // Charger les films depuis le CSV
  fetch('products.csv')
      .then(response => {
          console.log("Réponse fetch reçue.");
          return response.text();
      })
      .then(csvData => {
          console.log("Données CSV chargées.");
          const rows = csvData.split('\n').slice(1); // Exclure l'en-tête
          const genres = {};

          // Parsing des lignes CSV
          rows.forEach((row, index) => {
              const [movie_id, title, genreString, poster_id] = row.split(';');
              if (!movie_id || !title || !genreString || !poster_id) {
                  console.warn(`Ligne ignorée (${index + 1}) : données manquantes.`);
                  return;
              }

              genreString.split('|').forEach(genre => {
                  if (!genres[genre]) genres[genre] = [];
                  genres[genre].push({ title: title.trim(), poster_id: poster_id.trim() });
              });
          });

          console.log("Genres et films après parsing :", genres);

          // Ajouter les genres sélectionnés au carrousel
          selectedGenres.forEach(genre => {
              if (!genres[genre] || genres[genre].length === 0) {
                  console.warn(`Aucun film trouvé pour le genre : ${genre}`);
                  return;
              }

              const randomMovie = genres[genre][Math.floor(Math.random() * genres[genre].length)];
              console.log(`Film sélectionné pour ${genre} :`, randomMovie);

              const carouselItem = document.createElement('div');
              carouselItem.className = 'carousel-item';
              carouselItem.dataset.key = genre;
              carouselItem.dataset.description = randomMovie.title;
              carouselItem.style.backgroundImage = `url('static/${randomMovie.poster_id}.jpg')`;
              carouselItem.innerHTML = `<div class="text">${randomMovie.title}</div>`;
              carousel.appendChild(carouselItem);
          });

          // Ajouter des événements
          document.querySelectorAll('.carousel-item').forEach(item => {
              item.addEventListener('mouseenter', () => {
                  const genre = item.dataset.key.toLowerCase();
                  document.body.className = `${genre}-background`;
                  filmGenreSelectionne.textContent = `Film Genre: ${item.dataset.key}`;
                  filmDescription.textContent = item.dataset.description;
              });

              item.addEventListener('mouseleave', () => {
                  document.body.className = '';
                  filmDescription.textContent = 'Hover to discover your movie';
              });

              item.addEventListener('click', () => {
                  item.classList.add('watched');
                  console.log(`Film marqué comme vu : ${item.dataset.description}`);
              });
          });

          // Masquer l'écran de chargement
          document.getElementById('loading-screen').style.display = 'none';
          document.getElementById('main-content').style.display = 'block';
      })
      .catch(error => {
          console.error("Erreur lors du chargement des films :", error);
          document.getElementById('loading-screen').textContent = 'Erreur de chargement.';
      });
});

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('back-button');
  if (backButton) {
      backButton.addEventListener('click', () => {
          window.location.href = 'genres.html';
      });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const profileButtons = document.querySelectorAll('.select-button');
  profileButtons.forEach(button => {
      button.addEventListener('click', () => {
          const profile = button.dataset.profile;

          // Enregistrer le profil dans le localStorage
          localStorage.setItem('selectedProfile', profile);

          // Rediriger vers la page des genres
          window.location.href = 'genres.html';
      });
  });
});


