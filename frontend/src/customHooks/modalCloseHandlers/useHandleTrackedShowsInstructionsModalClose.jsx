const useHandleTrackedShowsInstructionsModalClose = (
  setTrackerInstructionsTrackedShowsModalOpen,
  makeTrackerPageInert,
  focusActiveElement,
  activeElement,
) => {
  const trackedShowsInstructionsModal = document.querySelector(
    ".tracked-shows-instructions-backdrop",
  );
  const trackedShowsInstructionsModalCloseButton = document.querySelector(
    "#tracked-shows-instructions-close-button",
  );
  trackedShowsInstructionsModal.inert = true;
  trackedShowsInstructionsModalCloseButton.tabIndex = -1;
  makeTrackerPageInert(false);
  trackedShowsInstructionsModal.classList.remove(
    "tracked-shows-instructions-backdrop-show",
  );
  setTimeout(() => {
    setTrackerInstructionsTrackedShowsModalOpen(false);
  }, 1000);
  focusActiveElement(activeElement);
};

export default useHandleTrackedShowsInstructionsModalClose;
