import axios from 'axios';

const useToggleDarkMode=async(
	boolean
)=>{
	const darkModeSetting=boolean;
	const data= await axios.post('/api/toggleDarkMode', {darkModeSetting});
	if(data.data.success===true){
		localStorage.setItem('userPrefersDarkMode', data.data.user.prefersDarkMode);
	};
};

export default useToggleDarkMode;
