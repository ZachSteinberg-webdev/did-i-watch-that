const useHandleTrackedShowInstructionsModalOpen=(
	setTrackerInstructionsTrackedShowModalOpen,
	makeTrackerPageInert,
	focusActiveModalCloseButton
)=>{
	setTrackerInstructionsTrackedShowModalOpen(true);
	setTimeout(()=>{
		const trackedShowInstructionsModal = document.querySelector('.tracked-show-instructions-backdrop');
		const trackedShowInstructionsModalCloseButton = document.querySelector('#tracked-show-instructions-close-button');
		trackedShowInstructionsModal.inert=false;
		trackedShowInstructionsModalCloseButton.tabIndex=0;
		makeTrackerPageInert(true);
		trackedShowInstructionsModal.classList.add('tracked-show-instructions-backdrop-show');
		focusActiveModalCloseButton(trackedShowInstructionsModalCloseButton);
	},300);
};

export default useHandleTrackedShowInstructionsModalOpen;
