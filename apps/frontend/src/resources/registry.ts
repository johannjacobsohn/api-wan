import type { ResourceType } from "../api/types";

export interface ResourceConfig {
  endpoint: ResourceType;
  label: string;
  displayField: "name" | "title";
  listColumns: { key: string; header: string }[];
  detailFields: { key: string; label: string }[];
  linkFields: string[];
}

export const RESOURCE_DISPLAY_NAME: Record<ResourceType, string> = {
  people: "People",
  films: "Films",
  planets: "Planets",
  species: "Species",
  vehicles: "Vehicles",
  starships: "Starships",
};

const REGISTRY: Record<ResourceType, ResourceConfig> = {
  people: {
    endpoint: "people",
    label: "People",
    displayField: "name",
    listColumns: [
      { key: "name", header: "Name" },
      { key: "height", header: "Height" },
      { key: "mass", header: "Mass" },
      { key: "gender", header: "Gender" },
      { key: "birth_year", header: "Birth Year" },
    ],
    detailFields: [
      { key: "name", label: "Name" },
      { key: "height", label: "Height" },
      { key: "mass", label: "Mass" },
      { key: "hair_color", label: "Hair Color" },
      { key: "skin_color", label: "Skin Color" },
      { key: "eye_color", label: "Eye Color" },
      { key: "birth_year", label: "Birth Year" },
      { key: "gender", label: "Gender" },
    ],
    linkFields: ["homeworld", "films", "species", "vehicles", "starships"],
  },
  films: {
    endpoint: "films",
    label: "Films",
    displayField: "title",
    listColumns: [
      { key: "title", header: "Title" },
      { key: "episode_id", header: "Episode" },
      { key: "director", header: "Director" },
      { key: "release_date", header: "Released" },
    ],
    detailFields: [
      { key: "title", label: "Title" },
      { key: "episode_id", label: "Episode" },
      { key: "director", label: "Director" },
      { key: "producer", label: "Producer" },
      { key: "release_date", label: "Release Date" },
      { key: "opening_crawl", label: "Opening Crawl" },
    ],
    linkFields: ["characters", "planets", "starships", "vehicles", "species"],
  },
  planets: {
    endpoint: "planets",
    label: "Planets",
    displayField: "name",
    listColumns: [
      { key: "name", header: "Name" },
      { key: "climate", header: "Climate" },
      { key: "terrain", header: "Terrain" },
      { key: "population", header: "Population" },
    ],
    detailFields: [
      { key: "name", label: "Name" },
      { key: "rotation_period", label: "Rotation Period" },
      { key: "orbital_period", label: "Orbital Period" },
      { key: "diameter", label: "Diameter" },
      { key: "climate", label: "Climate" },
      { key: "gravity", label: "Gravity" },
      { key: "terrain", label: "Terrain" },
      { key: "surface_water", label: "Surface Water" },
      { key: "population", label: "Population" },
    ],
    linkFields: ["residents", "films"],
  },
  species: {
    endpoint: "species",
    label: "Species",
    displayField: "name",
    listColumns: [
      { key: "name", header: "Name" },
      { key: "classification", header: "Classification" },
      { key: "designation", header: "Designation" },
      { key: "language", header: "Language" },
    ],
    detailFields: [
      { key: "name", label: "Name" },
      { key: "classification", label: "Classification" },
      { key: "designation", label: "Designation" },
      { key: "average_height", label: "Avg Height" },
      { key: "skin_colors", label: "Skin Colors" },
      { key: "hair_colors", label: "Hair Colors" },
      { key: "eye_colors", label: "Eye Colors" },
      { key: "average_lifespan", label: "Avg Lifespan" },
      { key: "language", label: "Language" },
    ],
    linkFields: ["homeworld", "people", "films"],
  },
  vehicles: {
    endpoint: "vehicles",
    label: "Vehicles",
    displayField: "name",
    listColumns: [
      { key: "name", header: "Name" },
      { key: "model", header: "Model" },
      { key: "manufacturer", header: "Manufacturer" },
      { key: "cost_in_credits", header: "Cost (credits)" },
    ],
    detailFields: [
      { key: "name", label: "Name" },
      { key: "model", label: "Model" },
      { key: "manufacturer", label: "Manufacturer" },
      { key: "cost_in_credits", label: "Cost (credits)" },
      { key: "length", label: "Length" },
      { key: "max_atmosphering_speed", label: "Max Speed" },
      { key: "crew", label: "Crew" },
      { key: "passengers", label: "Passengers" },
      { key: "cargo_capacity", label: "Cargo Capacity" },
      { key: "consumables", label: "Consumables" },
      { key: "vehicle_class", label: "Class" },
    ],
    linkFields: ["pilots", "films"],
  },
  starships: {
    endpoint: "starships",
    label: "Starships",
    displayField: "name",
    listColumns: [
      { key: "name", header: "Name" },
      { key: "model", header: "Model" },
      { key: "manufacturer", header: "Manufacturer" },
      { key: "cost_in_credits", header: "Cost (credits)" },
    ],
    detailFields: [
      { key: "name", label: "Name" },
      { key: "model", label: "Model" },
      { key: "manufacturer", label: "Manufacturer" },
      { key: "cost_in_credits", label: "Cost (credits)" },
      { key: "length", label: "Length" },
      { key: "max_atmosphering_speed", label: "Max Speed" },
      { key: "crew", label: "Crew" },
      { key: "passengers", label: "Passengers" },
      { key: "cargo_capacity", label: "Cargo Capacity" },
      { key: "consumables", label: "Consumables" },
      { key: "hyperdrive_rating", label: "Hyperdrive" },
      { key: "MGLT", label: "MGLT" },
      { key: "starship_class", label: "Class" },
    ],
    linkFields: ["pilots", "films"],
  },
};

export function getResourceConfig(resource: ResourceType): ResourceConfig {
  return REGISTRY[resource];
}

export function getAllResourceConfigs(): ResourceConfig[] {
  return Object.values(REGISTRY);
}
