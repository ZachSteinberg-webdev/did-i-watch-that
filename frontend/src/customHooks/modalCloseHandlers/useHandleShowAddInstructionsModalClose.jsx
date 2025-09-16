const useHandleShowAddInstructionsModalClose = (
  setTrackerInstructionsShowAddModalOpen,
  makeTrackerPageInert,
  focusActiveElement,
  activeElement,
) => {
  const showAddInstructionsModal = document.querySelector(
    ".show-add-instructions-backdrop",
  );
  const showAddInstructionsModalCloseButton = document.querySelector(
    "#show-add-instructions-close-button",
  );
  showAddInstructionsModal.inert = true;
  showAddInstructionsModalCloseButton.tabIndex = -1;
  makeTrackerPageInert(false);
  showAddInstructionsModal.classList.remove(
    "show-add-instructions-backdrop-show",
  );
  setTimeout(() => {
    setTrackerInstructionsShowAddModalOpen(false);
  }, 1000);
  focusActiveElement(activeElement);
};

export default useHandleShowAddInstructionsModalClose;
