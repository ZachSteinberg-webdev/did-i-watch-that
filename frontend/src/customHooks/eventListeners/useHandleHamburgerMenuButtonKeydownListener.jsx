const useHandleHamburgerMenuButtonKeydownListener=(
	hamburgerMenuButtonRef,
	contractHamburgerButton,
	setNavDropdownShown,
	hamburgerButtonExpanded,
	setHamburgerButtonExpanded
)=>{
	const bodyClickArea = document.querySelector('body');
	const hamburgerMenuButton = hamburgerMenuButtonRef.current;
	const navDropdown = document.querySelector('#nav-dropdown');
	const windowKeydown=(e)=>{
		if(e.altKey && e.code==='KeyH'){
			hamburgerMenuButton.focus({focusVisible: true});
		};
	};
	const handleBodyClick = (e)=>{
		contractHamburgerButton(hamburgerButtonExpanded, setHamburgerButtonExpanded);
		if(e.target!==navDropdown){
			if(navDropdown.classList.contains('show')){
				setNavDropdownShown(false);
				e.stopPropagation();
			};
		};
	};
	window.addEventListener('keydown', windowKeydown);
	bodyClickArea.addEventListener('click', handleBodyClick);
	return ()=>{
		bodyClickArea.removeEventListener('click', handleBodyClick);
		window.removeEventListener('keydown', windowKeydown);
	};
};

export default useHandleHamburgerMenuButtonKeydownListener;
