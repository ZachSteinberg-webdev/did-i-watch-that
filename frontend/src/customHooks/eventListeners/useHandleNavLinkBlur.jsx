const useHandleNavLinkBlur = (
  e,
  navDropdown,
  navDropdownShown,
  contractHamburgerButton,
  setNavDropdownShown,
  hamburgerButtonExpanded,
  setHamburgerButtonExpanded,
) => {
  if (!navDropdown.contains(e.relatedTarget)) {
    if (navDropdownShown) {
      contractHamburgerButton(
        hamburgerButtonExpanded,
        setHamburgerButtonExpanded,
      );
      setNavDropdownShown(false);
      e.stopPropagation();
    }
  }
};

export default useHandleNavLinkBlur;
