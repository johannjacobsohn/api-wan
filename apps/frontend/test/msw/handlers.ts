import { http, HttpResponse } from "msw";

const BASE = "https://swapi.info/api";

const luke = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  homeworld: `${BASE}/planets/1/`,
  films: [`${BASE}/films/1/`, `${BASE}/films/2/`],
  species: [],
  vehicles: [`${BASE}/vehicles/14/`],
  starships: [`${BASE}/starships/12/`],
  url: `${BASE}/people/1/`,
};

const c3po = {
  name: "C-3PO",
  height: "167",
  mass: "75",
  hair_color: "n/a",
  skin_color: "gold",
  eye_color: "yellow",
  birth_year: "112BBY",
  gender: "n/a",
  homeworld: `${BASE}/planets/1/`,
  films: [`${BASE}/films/1/`],
  species: [`${BASE}/species/2/`],
  vehicles: [],
  starships: [],
  url: `${BASE}/people/2/`,
};

const allPeople = [luke, c3po];

const film1 = {
  title: "A New Hope",
  episode_id: 4,
  opening_crawl: "It is a period of civil war...",
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1977-05-25",
  characters: [`${BASE}/people/1/`],
  planets: [`${BASE}/planets/1/`],
  starships: [],
  vehicles: [],
  species: [`${BASE}/species/1/`],
  url: `${BASE}/films/1/`,
};

const film2 = {
  title: "The Empire Strikes Back",
  episode_id: 5,
  opening_crawl: "It is a dark time for the Rebellion...",
  director: "Irvin Kershner",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1980-05-21",
  characters: [`${BASE}/people/1/`],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  url: `${BASE}/films/2/`,
};

const allFilms = [film1, film2];

const planet1 = {
  name: "Tatooine",
  rotation_period: "23",
  orbital_period: "304",
  diameter: "10465",
  climate: "arid",
  gravity: "1 standard",
  terrain: "desert",
  surface_water: "1",
  population: "200000",
  residents: [`${BASE}/people/1/`],
  films: [`${BASE}/films/1/`],
  url: `${BASE}/planets/1/`,
};

export const handlers = [
  http.get(`${BASE}/people/`, () => HttpResponse.json(allPeople)),
  http.get(`${BASE}/people/1/`, () => HttpResponse.json(luke)),
  http.get(`${BASE}/people/2/`, () => HttpResponse.json(c3po)),
  http.get(`${BASE}/films/`, () => HttpResponse.json(allFilms)),
  http.get(`${BASE}/films/1/`, () => HttpResponse.json(film1)),
  http.get(`${BASE}/planets/`, () => HttpResponse.json([planet1])),
  http.get(`${BASE}/planets/1/`, () => HttpResponse.json(planet1)),
  http.get(`${BASE}/species/`, () => HttpResponse.json([])),
  http.get(`${BASE}/species/2/`, () =>
    HttpResponse.json({
      name: "Droid",
      classification: "artificial",
      designation: "sentient",
      average_height: "n/a",
      skin_colors: "n/a",
      hair_colors: "n/a",
      eye_colors: "n/a",
      average_lifespan: "indefinite",
      language: "n/a",
      homeworld: null,
      people: [],
      films: [],
      url: `${BASE}/species/2/`,
    }),
  ),
  http.get(`${BASE}/vehicles/14/`, () =>
    HttpResponse.json({
      name: "Snowspeeder",
      model: "t-47 airspeeder",
      manufacturer: "Incom Corporation",
      cost_in_credits: "unknown",
      length: "4.5",
      max_atmosphering_speed: "650",
      crew: "2",
      passengers: "0",
      cargo_capacity: "10",
      consumables: "none",
      vehicle_class: "airspeeder",
      pilots: [],
      films: [],
      url: `${BASE}/vehicles/14/`,
    }),
  ),
  http.get(`${BASE}/starships/12/`, () =>
    HttpResponse.json({
      name: "X-wing",
      model: "T-65 X-wing",
      manufacturer: "Incom Corporation",
      cost_in_credits: "149999",
      length: "12.5",
      max_atmosphering_speed: "1050",
      crew: "1",
      passengers: "0",
      cargo_capacity: "110",
      consumables: "1 week",
      hyperdrive_rating: "1.0",
      MGLT: "100",
      starship_class: "Starfighter",
      pilots: [],
      films: [],
      url: `${BASE}/starships/12/`,
    }),
  ),
  http.get(`${BASE}/people/999/`, () => new HttpResponse(null, { status: 404 })),
  http.get(`${BASE}/films/2/`, () => HttpResponse.json(film2)),
  http.get(`${BASE}/films/999/`, () => new HttpResponse(null, { status: 404 })),
  http.get(`${BASE}/nonexistent/`, () => new HttpResponse(null, { status: 404 })),
  http.get(`${BASE}/error/`, () => new HttpResponse(null, { status: 500 })),
];
