const useHandleShowAddInstructionsModalOpen=(
	setTrackerInstructionsShowAddModalOpen,
	makeTrackerPageInert,
	focusActiveModalCloseButton
)=>{
	setTrackerInstructionsShowAddModalOpen(true);
	setTimeout(()=>{
		const modalElement = document.querySelector('.show-add-instructions-backdrop');
		const modalElementCloseButton = document.querySelector('#show-add-instructions-close-button');
		modalElement.inert=false;
		modalElementCloseButton.tabIndex=0;
		makeTrackerPageInert(true);
		modalElement.classList.add('show-add-instructions-backdrop-show');
		focusActiveModalCloseButton(modalElementCloseButton);
	},300);
};

export default useHandleShowAddInstructionsModalOpen;
