const useContractHamburgerButton=(
	hamburgerButtonExpanded,
	setHamburgerButtonExpanded
)=>{
	if(hamburgerButtonExpanded){
		const userButtonPiece1=document.querySelector('.user-button-piece-1');
		const userButtonPiece2=document.querySelector('.user-button-piece-2');
		const userButtonPiece3=document.querySelector('.user-button-piece-3');
		const userButtonPiece4=document.querySelector('.user-button-piece-4');
		const userButtonPiece5=document.querySelector('.user-button-piece-5');
		const userButtonPiece6=document.querySelector('.user-button-piece-6');
		if(userButtonPiece1){
			userButtonPiece1.classList.remove('user-button-piece-1-clicked');
		};
		if(userButtonPiece2){
			userButtonPiece2.classList.remove('user-button-piece-2-clicked');
		};
		if(userButtonPiece3){
			userButtonPiece3.classList.remove('user-button-piece-3-clicked');
		};
		if(userButtonPiece4){
			userButtonPiece4.classList.remove('user-button-piece-4-clicked');
		};
		if(userButtonPiece5){
			userButtonPiece5.classList.remove('user-button-piece-5-clicked');
		};
		if(userButtonPiece6){
			userButtonPiece6.classList.remove('user-button-piece-6-clicked');
		};
		setHamburgerButtonExpanded(false);
	};
};

export default useContractHamburgerButton;
