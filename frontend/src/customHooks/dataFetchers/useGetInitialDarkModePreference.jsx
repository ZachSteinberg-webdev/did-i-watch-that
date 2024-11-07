const useGetInitialDarkModePreference=()=>{
	const prefersDarkMode=window.matchMedia('(prefers-color-scheme:dark)');
	let usersDarkModePreference = JSON.parse(localStorage.getItem('userPrefersDarkMode'));
	if(usersDarkModePreference===true && prefersDarkMode.matches===false){
		document.body.classList.add('dark-mode');
	}else if(usersDarkModePreference===false && prefersDarkMode.matches===true){
		document.body.classList.add('light-mode');
	};
	setTimeout(()=>{
		document.body.style.transition='color 2000ms, background-color 2000ms, border-color 2000ms, border-width 2000ms, box-shadow 2000ms, fill 2000ms';
		const newStyle=document.createElement('style');
		newStyle.innerHTML=`
			button{
				transition: border-color 0.25s, color 2000ms, background-color 2000ms, border-width 2000ms, box-shadow 2000ms, fill 2000ms;
			}
			input{
				transition: color 2000ms, background-color 2000ms, border-color 2000ms, border-width 2000ms, box-shadow 2000ms, fill 2000ms;
			}
			a{
				transition: color 2000ms, text-shadow 500ms;
			}
			a:-webkit-any-link{
				transition: color 2000ms, text-shadow 500ms;
			}
		`;
		document.head.appendChild(newStyle);
	},200);
	return usersDarkModePreference;
};

export default useGetInitialDarkModePreference;
