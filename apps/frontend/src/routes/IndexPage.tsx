import { APP_NAME } from "../constants";

export function IndexPage() {
  return (
    <article>
      <h2>Welcome to {APP_NAME}</h2>
      <p>Select a resource type above to browse Star Wars data.</p>
    </article>
  );
}
