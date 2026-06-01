interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "An error occurred" }: ErrorStateProps) {
  return (
    <article>
      <h2>Error</h2>
      <p>{message}</p>
    </article>
  );
}
