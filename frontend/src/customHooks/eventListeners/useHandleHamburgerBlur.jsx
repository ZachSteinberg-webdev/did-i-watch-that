const useHandleHamburgerBlur = (
	e,
	navDropdown,
	contractHamburgerButton,
	navDropdownShown,
	setNavDropdownShown,
	hamburgerButtonExpanded,
	setHamburgerButtonExpanded
) => {
	if (!navDropdown.contains(e.relatedTarget)) {
		contractHamburgerButton(hamburgerButtonExpanded, setHamburgerButtonExpanded);
		if (navDropdownShown) {
			setNavDropdownShown(false);
			e.stopPropagation();
		}
	}
};

export default useHandleHamburgerBlur;
