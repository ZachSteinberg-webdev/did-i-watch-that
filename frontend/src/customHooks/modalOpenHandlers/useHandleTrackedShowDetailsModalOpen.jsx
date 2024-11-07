const useHandleTrackedShowDetailsModalOpen=(
	setTrackedShowDetailsModalOpen,
	makeTrackerPageInert,
	focusShowDetailsModalCloseButton
)=>{
	setTrackedShowDetailsModalOpen(true);
	setTimeout(()=>{
		const trackedShowDetailsModal = document.querySelector('.tracked-show-details-backdrop');
		const trackedShowDetailsModalCloseButton = document.querySelector('.tracked-show-details-close-button');
		trackedShowDetailsModal.inert=false;
		makeTrackerPageInert(true);
		trackedShowDetailsModal.classList.add('tracked-show-details-backdrop-show');
		focusShowDetailsModalCloseButton(trackedShowDetailsModalCloseButton);
	},100);
};

export default useHandleTrackedShowDetailsModalOpen;
