document.addEventListener('DOMContentLoaded', () => {
    fetchAllFilms();
});

function fetchAllFilms() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(allMovies => {
            renderFilmList(allMovies);
            if (allMovies.length > 0) {
                fetchFilmDetails(allMovies[0].id);
            }
        });
}

function fetchFilmDetails(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(selectedMovie => {
            displayFilmDetails(selectedMovie);
        });
}

function displayFilmDetails(film) {
    const currentCapacity = film.capacity;
    const ticketsSold = film.tickets_sold; 
    const availableTickets = currentCapacity - ticketsSold;

    const posterImage = document.querySelector('#poster');
    posterImage.src = film.poster;

    const filmTitle = document.querySelector('#title');
    filmTitle.textContent = film.title;

    const filmDuration = document.querySelector('#runtime');
    filmDuration.textContent = `${film.runtime} minutes`;

    const filmDescription = document.querySelector('#film-info');
    filmDescription.textContent = film.description;

    const filmShowtime = document.querySelector('#showtime');
    filmShowtime.textContent = film.showtime;

    const availableTicketCount = document.querySelector('#ticket-num');
    availableTicketCount.textContent = `${availableTickets} remaining tickets`;

    const buyTicketButton = document.querySelector('#buy-ticket');
    buyTicketButton.disabled = availableTickets <= 0;
    buyTicketButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';

    
    buyTicketButton.dataset.filmId = film.id;
    buyTicketButton.onclick = () => {
        purchaseTicket(buyTicketButton.dataset.filmId);
    };
}

function renderFilmList(films) {
    const filmList = document.querySelector('#films');
    filmList.textContent = ''; 

    films.forEach(film => {
        const listItem = document.createElement('li');
        listItem.className = "film item";
        listItem.textContent = film.title;
        listItem.dataset.id = film.id;

        listItem.addEventListener("click", () => {
            fetchFilmDetails(film.id);
        });

        filmList.appendChild(listItem);
    });
}

function purchaseTicket(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            if (film.tickets_sold < film.capacity) {
                film.tickets_sold++;

                return fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tickets_sold: film.tickets_sold }),
                });
            } else {
                alert("No more tickets available!");
            }
        })
        .then(() => {
            fetchFilmDetails(filmId);
        })
}
