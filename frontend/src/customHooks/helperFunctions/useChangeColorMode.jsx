import useToggleDarkMode from '../stateChanges/useToggleDarkMode.jsx';

const useChangeColorMode = (user, setDarkMode, prefersDarkMode, changeColorModeWrapper, e) => {
	if (e.matches) {
		document.body.classList.remove('dark-mode');
		document.body.classList.remove('light-mode');
		if (user && setDarkMode) {
			setDarkMode(true);
			useToggleDarkMode(true, user);
			prefersDarkMode.removeEventListener('change', changeColorModeWrapper, true);
			setTimeout(() => {
				prefersDarkMode.addEventListener('change', changeColorModeWrapper, true);
			}, 200);
		}
	} else {
		document.body.classList.remove('dark-mode');
		document.body.classList.remove('light-mode');
		if (user && setDarkMode) {
			setDarkMode(false);
			useToggleDarkMode(false, user);
			prefersDarkMode.removeEventListener('change', changeColorModeWrapper, true);
			setTimeout(() => {
				prefersDarkMode.addEventListener('change', changeColorModeWrapper, true);
			}, 200);
		}
	}
};

export default useChangeColorMode;
