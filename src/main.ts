import { IFilms, IFilmsResult } from './interfaces/IFilmen';
import { IPeople, IPeopleResult } from './interfaces/IPeople';
import { IPlanets, IPlanetsResult } from './interfaces/IPlanets';
import './style.css'

const navigationFilmen = document.querySelector(".navigation__filmen") as HTMLElement;
const navigationPlaneten = document.querySelector(".navigation__planeten") as HTMLElement;
const navigationPersonen = document.querySelector(".navigation__personen") as HTMLElement;
const searchInput = document.querySelector("#search") as HTMLInputElement;
const app = document.querySelector("#app") as HTMLElement;

const URL_BASE = "https://swapi.dev/api/";

const fetchDetails = async (url:string) => {
  const newUrl:string = `${URL_BASE + url}`;
  const respone: Response = await fetch(newUrl);
  const data = await respone.json();
  return data;
}

const renderFilm = (data:IFilms) => {
  const results:IFilmsResult[] = data.results
  app.innerHTML = "";
  results.forEach((element:IFilmsResult) => {
    const cardDiv = document.createElement("div") as HTMLElement;
    cardDiv.innerHTML = `
    <li>${element.title}</li>
    `
    app.append(cardDiv)
  });
}

const renderPlanets = (data:IPlanets) => {
  const results:IPlanetsResult[] = data.results
  app.innerHTML = "";
  results.forEach((element:IPlanetsResult) => {
    const cardDiv = document.createElement("div") as HTMLElement;
    cardDiv.innerHTML = `
    <li>${element.name}</li>
    `
    app.append(cardDiv)
  });
}

const renderPeople = (data:IPeople) => {
  const results:IPeopleResult[] = data.results
  app.innerHTML = "";
  results.forEach((element:IPeopleResult) => {
    const cardDiv = document.createElement("div") as HTMLElement;
    cardDiv.innerHTML = `
    <li>${element.name}</li>
    `
    app.append(cardDiv)
  });
}


navigationFilmen.addEventListener("click", async () => {
  const data = await fetchDetails("films/");
  renderFilm(data); 
})

navigationPlaneten.addEventListener("click", async () => {
  const data = await fetchDetails("planets/");
  renderPlanets(data); 
})

navigationPersonen.addEventListener("click", async () => {
  const data = await fetchDetails("people/");
  renderPeople(data); 
})


const fetchSearchResults = async (query: string, endpoint: string) => {
  const url = `${URL_BASE}${endpoint}/?search=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results; 
};

const searchAll = async (query: string) => {
  const [films, planets, people] = await Promise.all([
    fetchSearchResults(query, "films"),
    fetchSearchResults(query, "planets"),
    fetchSearchResults(query, "people"),
  ]);

  return { films, planets, people };
};


const renderSearchResults = (results: { films: IFilmsResult[]; planets: IPlanetsResult[]; people: IPeopleResult[]}) => {
  app.innerHTML = ""; 


  if (results.films.length > 0) {
    const filmSection = document.createElement("div");
    filmSection.innerHTML = `<h2>Filmen</h2>`;
    results.films.forEach((film) => {
      const filmItem = document.createElement("div");
      filmItem.innerHTML = `<li>${film.title}</li>`;
      filmSection.append(filmItem);
    });
    app.append(filmSection);
  }


  if (results.planets.length > 0) {
    const planetSection = document.createElement("div");
    planetSection.innerHTML = `<h2>Planets</h2>`;
    results.planets.forEach((planet) => {
      const planetItem = document.createElement("div");
      planetItem.innerHTML = `<li>${planet.name}</li>`;
      planetSection.append(planetItem);
    });
    app.append(planetSection);
  }


  if (results.people.length > 0) {
    const peopleSection = document.createElement("div");
    peopleSection.innerHTML = `<h2>People</h2>`;
    results.people.forEach((person) => {
      const personItem = document.createElement("div");
      personItem.innerHTML = `<li>${person.name}</li>`;
      peopleSection.append(personItem);
    });
    app.append(peopleSection);
  }
};

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length === 0) {
    app.innerHTML = "<p>Geben sie suchtext ein</p>";
    return;
  }

  const results = await searchAll(query);
  renderSearchResults(results);
});