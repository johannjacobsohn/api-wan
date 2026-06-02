import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsSun, BsMoon, BsCircleHalf } from "react-icons/bs";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Synchronous setState is required here to suppress hydration mismatch
    // on first client render with next-themes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span style={{ width: 24, display: "inline-block" }} />;
  }

  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const icon = theme === "dark" ? <BsMoon /> : theme === "light" ? <BsSun /> : <BsCircleHalf />;

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Click to switch to ${next}.`}
      className="outline"
      style={{ padding: "0.5rem", border: 0 }}
    >
      {icon}
    </button>
  );
}
