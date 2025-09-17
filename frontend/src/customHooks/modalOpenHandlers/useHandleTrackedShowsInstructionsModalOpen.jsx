const useHandleTrackedShowsInstructionsModalOpen = (
	setTrackerInstructionsTrackedShowsModalOpen,
	makeTrackerPageInert,
	focusActiveModalCloseButton
) => {
	setTrackerInstructionsTrackedShowsModalOpen(true);
	setTimeout(() => {
		const trackedShowsInstructionsModal = document.querySelector('.tracked-shows-instructions-backdrop');
		const trackedShowsInstructionsModalCloseButton = document.querySelector('#tracked-shows-instructions-close-button');
		trackedShowsInstructionsModal.inert = false;
		trackedShowsInstructionsModalCloseButton.tabIndex = 0;
		makeTrackerPageInert(true);
		trackedShowsInstructionsModal.classList.add('tracked-shows-instructions-backdrop-show');
		focusActiveModalCloseButton(trackedShowsInstructionsModalCloseButton);
	}, 300);
};

export default useHandleTrackedShowsInstructionsModalOpen;
