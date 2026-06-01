import { Link } from "@tanstack/react-router";
import { getAllResourceConfigs } from "../resources/registry";
import {
  BsPeople,
  BsCameraVideo,
  BsGlobe,
  BsRobot,
  BsTruck,
  BsRocket,
} from "react-icons/bs";
import type { ResourceType } from "../api/types";
import type { ReactNode } from "react";

const ICON_MAP: Record<ResourceType, ReactNode> = {
  people: <BsPeople />,
  films: <BsCameraVideo />,
  planets: <BsGlobe />,
  species: <BsRobot />,
  vehicles: <BsTruck />,
  starships: <BsRocket />,
};

export function ResourceNav() {
  const configs = getAllResourceConfigs();

  return (
    <nav>
      <ul>
        {configs.map((c) => (
          <li key={c.endpoint}>
            <Link to="/$resource" params={{ resource: c.endpoint }}>
              {ICON_MAP[c.endpoint]} {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
