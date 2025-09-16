const useHandleNavLinkKeyDown = (
  e,
  contractHamburgerButton,
  setNavDropdownShown,
  hamburgerButtonExpanded,
  setHamburgerButtonExpanded,
) => {
  if (e.code === "Escape") {
    contractHamburgerButton(
      hamburgerButtonExpanded,
      setHamburgerButtonExpanded,
    );
    setNavDropdownShown(false);
  }
};

export default useHandleNavLinkKeyDown;
