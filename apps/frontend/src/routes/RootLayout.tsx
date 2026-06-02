import { Link, Outlet } from "@tanstack/react-router";
import { ResourceNav } from "../components/ResourceNav";
import { GiEnergySword } from "react-icons/gi";
import { ThemeToggle } from "../components/ThemeToggle";
import { NotFound } from "../components/NotFound";
import { APP_NAME } from "../constants";

export function RootLayout() {
  return (
    <>
      <header>
        <div className="header-bar">
          <Link to="/" className="app-name">
            <span className="rainbow-icon">
              <GiEnergySword />
            </span>
            <span className="app-name-text">{APP_NAME}</span>
          </Link>
          <ThemeToggle />
        </div>
        <ResourceNav />
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export function NotFoundFallback() {
  return <NotFound />;
}
