const useHandleTrackedShowDetailsModalClose=(
	setTrackedShowDetailsModalOpen,
	makeTrackerPageInert,
	focusActiveElement,
	activeElement
)=>{
	const trackedShowDetailsModal = document.querySelector('.tracked-show-details-backdrop');
	const trackedShowDetailsModalCloseButton = document.querySelector('.tracked-show-details-close-button');
	trackedShowDetailsModal.inert=true;
	trackedShowDetailsModalCloseButton.tabIndex=-1;
	makeTrackerPageInert(false);
	trackedShowDetailsModal.classList.remove('tracked-show-details-backdrop-show');
	setTimeout(()=>{
		setTrackedShowDetailsModalOpen(false);
	},1000);
	focusActiveElement(activeElement);
};

export default useHandleTrackedShowDetailsModalClose;
