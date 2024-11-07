const trackerShowAddFormInput=document.querySelector('#tracker-show-add-form-input');

const focusActiveElement=(activeElement)=>{
	if(activeElement===null){
		setTimeout(()=>{
			trackerShowAddFormInput.focus({focusVisible: true});
		}, 1000);
	}else{
		setTimeout(()=>{
			activeElement.focus({focusVisible: true});
		}, 1000);
	};
};

export default focusActiveElement;
