import useToggleDarkMode from "../stateChanges/useToggleDarkMode.jsx";

const useHandleDarkModeToggle = (e, darkMode, setDarkMode) => {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)");
  if (darkMode === true && prefersDarkMode.matches === false) {
    setDarkMode(false);
    useToggleDarkMode(false);
    document.body.classList.remove("dark-mode");
  } else if (darkMode === false && prefersDarkMode.matches === false) {
    setDarkMode(true);
    useToggleDarkMode(true);
    document.body.classList.add("dark-mode");
  } else if (darkMode === true && prefersDarkMode.matches === true) {
    setDarkMode(false);
    useToggleDarkMode(false);
    document.body.classList.add("light-mode");
  } else if (darkMode === false && prefersDarkMode.matches === true) {
    setDarkMode(true);
    useToggleDarkMode(true);
    document.body.classList.remove("light-mode");
  }
};

export default useHandleDarkModeToggle;
