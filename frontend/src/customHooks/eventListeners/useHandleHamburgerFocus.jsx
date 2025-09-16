const useHandleHamburgerFocus = (
  e,
  setHamburgerFocusTimeStamp,
  expandHamburgerButton,
  navDropdownShown,
  setNavDropdownShown,
  hamburgerButtonExpanded,
  setHamburgerButtonExpanded,
) => {
  setHamburgerFocusTimeStamp(e.timeStamp);
  expandHamburgerButton(hamburgerButtonExpanded, setHamburgerButtonExpanded);
  if (!navDropdownShown) {
    setNavDropdownShown(true);
    e.stopPropagation();
  }
};

export default useHandleHamburgerFocus;
