import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import useAddTrackedShowToState from '../stateChanges/useAddTrackedShowToState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleAddedShowSubmit=async(
	e,
	setTrackedShowsSpinner,
	user,
	setTrackedShows,
	navigate
)=>{
	let trackedShowsBoxWrapper=document.querySelector('.tracker-tracked-shows-list-container-wrapper');
	let trackedShowsList=document.querySelector('.tracker-tracked-shows-list-container');
	e.preventDefault();
	makeAllInputAreasInert(true);
	setTrackedShowsSpinner(true);
	const postedShowDataString = e.target[0].value;
	const postedShowDataObject = await JSON.parse(postedShowDataString);
	try{
		const data = await axios.post('/api/addShow', {user, postedShowDataObject});
		if(data.data.success===true){
			toast.success(<Toast icon='👍' messageParagraph={data.data.message[0]}/>, {icon: false});
			trackedShowsBoxWrapper.classList.add('tracker-tracked-shows-list-container-wrapper-flash');
			setTimeout(()=>{
				trackedShowsList.children[0]?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
			},200);
			setTimeout(()=>{
				trackedShowsBoxWrapper.classList.remove('tracker-tracked-shows-list-container-wrapper-flash');
			},250);
			useAddTrackedShowToState(setTrackedShows, data.data.returnedListOfTrackedShows.shows);
		}else if(data.data.success===false){
			toast.error(<Toast icon='🤦‍♂️' icon2='🤦‍♀️' messageParagraphTwoIcons={data.data.error[0]}/>, {icon: false});
		};
	}catch(err){
		if(err.response.status && err.response.status===401){
			console.log('Caught 401 "unauthorized" error from handleAddedShowSubmit in frontend Tracker.jsx', err);
			setTrackedShowsSpinner(false);
			makeAllInputAreasInert(false);
			unauthorized401Response(navigate);
		}else{
			console.log('Caught error from Tracker.jsx handleAddedShowSubmit block', err);
			const message='Something went wrong. :( Please try again later.';
			toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
		};
	};
	setTrackedShowsSpinner(false);
	makeAllInputAreasInert(false);
	setTimeout(()=>{
		trackedShowsList.focus({focusVisible: true});
	}, 50);
};

export default useHandleAddedShowSubmit;
