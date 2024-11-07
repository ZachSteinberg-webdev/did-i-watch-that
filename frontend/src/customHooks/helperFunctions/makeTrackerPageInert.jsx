const makeTrackerPageInert=(boolean)=>{
	let header = document.querySelector('.header-container');
	let trackerPage = document.querySelector('#tracker-page');
	let footer = document.querySelector('.footer');
	if(boolean===true){
		header.inert=true;
		trackerPage.inert=true;
		footer.inert=true;
	}else if(boolean===false){
		header.inert=false;
		trackerPage.inert=false;
		footer.inert=false;
	};
};

export default makeTrackerPageInert;
