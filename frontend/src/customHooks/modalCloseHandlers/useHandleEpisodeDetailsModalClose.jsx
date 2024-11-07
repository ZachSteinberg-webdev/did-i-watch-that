const useHandleEpisodeDetailsModalClose=(
	episodeModalCloseButton,
	setEpisodeOpenModalClicked,
	makeTrackerPageInert,
	setTrackedShowEpisodeDetailsModalOpen,
	focusActiveElement,
	activeElement
)=>{
	const trackedShowEpisodeDetailsModal = document.querySelector('.tracked-show-episode-details-backdrop');
	let trackedShowEpisodeDetailsModalCloseButton = document.querySelector('.tracked-show-episode-details-close-button');
	setEpisodeOpenModalClicked(false);
	episodeModalCloseButton.tabIndex=-1;
	trackedShowEpisodeDetailsModal.inert=true;
	makeTrackerPageInert(false);
	trackedShowEpisodeDetailsModal.classList.remove('tracked-show-episode-details-backdrop-show');
	setTimeout(()=>{
		setTrackedShowEpisodeDetailsModalOpen(false);
	},1000);
	focusActiveElement(activeElement);
};

export default useHandleEpisodeDetailsModalClose;
