const usePrefersDarkMode = (user, setDarkMode) => {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)");
  // prefersDarkMode.addEventListener('change', changeColorModeWrapper, true);
  return prefersDarkMode.matches;
};

export default usePrefersDarkMode;
