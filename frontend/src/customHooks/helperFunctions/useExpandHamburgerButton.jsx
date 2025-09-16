const useExpandHamburgerButton = (
  hamburgerButtonExpanded,
  setHamburgerButtonExpanded,
) => {
  if (!hamburgerButtonExpanded) {
    const userButtonPiece1 = document.querySelector(".user-button-piece-1");
    const userButtonPiece2 = document.querySelector(".user-button-piece-2");
    const userButtonPiece3 = document.querySelector(".user-button-piece-3");
    const userButtonPiece4 = document.querySelector(".user-button-piece-4");
    const userButtonPiece5 = document.querySelector(".user-button-piece-5");
    const userButtonPiece6 = document.querySelector(".user-button-piece-6");
    userButtonPiece1.classList.add("user-button-piece-1-clicked");
    userButtonPiece2.classList.add("user-button-piece-2-clicked");
    userButtonPiece3.classList.add("user-button-piece-3-clicked");
    userButtonPiece4.classList.add("user-button-piece-4-clicked");
    userButtonPiece5.classList.add("user-button-piece-5-clicked");
    userButtonPiece6.classList.add("user-button-piece-6-clicked");
    setHamburgerButtonExpanded(true);
  }
};

export default useExpandHamburgerButton;
