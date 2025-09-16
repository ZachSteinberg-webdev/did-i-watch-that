const focusShowDetailsModalCloseButton = (button) => {
  setTimeout(() => {
    button.tabIndex = 0;
    button.focus({ focusVisible: true });
  }, 500);
};

export default focusShowDetailsModalCloseButton;
