const useHandleTrackedShowInstructionsModalClose=(
	setTrackerInstructionsTrackedShowModalOpen,
	makeTrackerPageInert,
	focusActiveElement,
	activeElement
)=>{
	const trackedShowInstructionsModal = document.querySelector('.tracked-show-instructions-backdrop');
	const trackedShowInstructionsModalCloseButton = document.querySelector('#tracked-show-instructions-close-button');
	trackedShowInstructionsModal.inert=true;
	trackedShowInstructionsModalCloseButton.tabIndex=-1;
	makeTrackerPageInert(false);
	trackedShowInstructionsModal.classList.remove('tracked-show-instructions-backdrop-show');
	setTimeout(()=>{
		setTrackerInstructionsTrackedShowModalOpen(false);
	},1000);
	focusActiveElement(activeElement);
};

export default useHandleTrackedShowInstructionsModalClose;
