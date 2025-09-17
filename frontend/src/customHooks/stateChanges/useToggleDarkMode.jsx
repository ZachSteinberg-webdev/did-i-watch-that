import axios from 'axios';

const useToggleDarkMode = async (boolean) => {
	const darkModeSetting = boolean;
	const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
	if (guestMode) {
		localStorage.setItem('userPrefersDarkMode', JSON.stringify(darkModeSetting));
		return;
	}
	const data = await axios.post('/api/toggleDarkMode', { darkModeSetting });
	if (data.data.success === true) {
		localStorage.setItem('userPrefersDarkMode', data.data.user.prefersDarkMode);
	}
};

export default useToggleDarkMode;
