const focusEpisodeDetailsModalCloseButton=(button)=>{
	button.tabIndex=0;
	setTimeout(()=>{
		if(button){
			button.focus({focusVisible: true});
		};
	}, 500);
};

export default focusEpisodeDetailsModalCloseButton;
