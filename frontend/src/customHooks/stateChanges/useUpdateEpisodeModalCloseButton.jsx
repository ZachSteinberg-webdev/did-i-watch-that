const useUpdateEpisodeModalCloseButton = (
  setEpisodeModalCloseButton,
  episodeModalOpenButtonClicked,
  focusEpisodeDetailsModalCloseButton,
  button,
) => {
  setEpisodeModalCloseButton(button);
  if (episodeModalOpenButtonClicked) {
    if (
      !button.classList.contains(
        "tracked-show-episode-details-close-button-loading",
      )
    ) {
      focusEpisodeDetailsModalCloseButton(button);
    }
  }
};

export default useUpdateEpisodeModalCloseButton;
