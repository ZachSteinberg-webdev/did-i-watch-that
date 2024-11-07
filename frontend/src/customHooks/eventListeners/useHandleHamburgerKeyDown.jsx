const useHandleHamburgerKeyDown = (
	e,
	contractHamburgerButton,
	setNavDropdownShown,
	expandContractHamburgerButton,
	navDropdownShown,
	hamburgerButtonExpanded,
	setHamburgerButtonExpanded
)=>{
	if(e.code==='Escape'){
		contractHamburgerButton();
		setNavDropdownShown(false);
	}else if(e.altKey && e.code==='KeyH'){
		expandContractHamburgerButton(hamburgerButtonExpanded, setHamburgerButtonExpanded);
		setNavDropdownShown(!navDropdownShown);
		e.stopPropagation();
	};
};

export default useHandleHamburgerKeyDown;
