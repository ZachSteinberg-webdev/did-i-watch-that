let hamburgerClickTimeStamp = 0;

const useHandleHamburgerClick = (
	e,
	hamburgerFocusTimeStamp,
	expandContractHamburgerButton,
	navDropdownShown,
	setNavDropdownShown,
	hamburgerButtonExpanded,
	setHamburgerButtonExpanded
) => {
	hamburgerClickTimeStamp = e.timeStamp;
	if (hamburgerClickTimeStamp - hamburgerFocusTimeStamp >= 300) {
		expandContractHamburgerButton(hamburgerButtonExpanded, setHamburgerButtonExpanded);
		setNavDropdownShown(!navDropdownShown);
	}
	e.stopPropagation();
};

export default useHandleHamburgerClick;
