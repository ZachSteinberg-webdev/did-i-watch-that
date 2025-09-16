const useHandleEpisodeDetailsModalOpen = (
  setTrackedShowEpiodeDetailsModalOpen,
  makeTrackerPageInert,
  setEpisodeModalOpenButtonClicked,
) => {
  setTrackedShowEpiodeDetailsModalOpen(true);
  setTimeout(() => {
    const trackedShowEpisodeDetailsModal = document.querySelector(
      ".tracked-show-episode-details-backdrop",
    );
    let trackedShowEpisodeDetailsModalCloseButton = document.querySelector(
      ".tracked-show-episode-details-close-button",
    );
    trackedShowEpisodeDetailsModal.inert = false;
    makeTrackerPageInert(true);
    trackedShowEpisodeDetailsModal.classList.add(
      "tracked-show-episode-details-backdrop-show",
    );
    setEpisodeModalOpenButtonClicked(true);
  }, 100);
};

export default useHandleEpisodeDetailsModalOpen;
