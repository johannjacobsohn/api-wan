import { Link } from "@tanstack/react-router";
import { getAllResourceConfigs } from "../resources/registry";
import {
  GiPerson,
  GiFilmProjector,
  GiRingedPlanet,
  GiDna1,
  GiScoutShip,
  GiStarfighter,
} from "react-icons/gi";
import type { ResourceType } from "../api/types";
import type { ReactNode } from "react";

const ICON_MAP: Record<ResourceType, ReactNode> = {
  people: <GiPerson />,
  films: <GiFilmProjector />,
  planets: <GiRingedPlanet />,
  species: <GiDna1 />,
  vehicles: <GiScoutShip />,
  starships: <GiStarfighter />,
};

export function ResourceNav() {
  const configs = getAllResourceConfigs();

  return (
    <nav className="resource-sub-nav" aria-label="Browse resources">
      <ul>
        {configs.map((c) => (
          <li key={c.endpoint}>
            <Link
              to="/$resource"
              params={{ resource: c.endpoint }}
              activeProps={{ "aria-current": "page" }}
              activeOptions={{ exact: false }}
            >
              <span className="nav-icon" aria-hidden="true">
                {ICON_MAP[c.endpoint]}
              </span>
              <span className="resource-nav-label">{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
