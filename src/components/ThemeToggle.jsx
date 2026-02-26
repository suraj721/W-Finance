import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-full border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-400 dark:bg-[#111111] dark:border-[#222222] dark:text-slate-500 dark:hover:text-primary dark:hover:border-primary/50 flex items-center justify-center transition-all"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      type="button"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2m0 14v2M5.64 5.64l1.41 1.41m9.9 9.9l1.41 1.41M3 12h2m14 0h2M5.64 18.36l1.41-1.41m9.9-9.9l1.41-1.41M12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
