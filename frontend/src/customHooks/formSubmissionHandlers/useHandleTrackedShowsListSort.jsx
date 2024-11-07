import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import useAddTrackedShowToState from '../stateChanges/useAddTrackedShowToState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleTrackedShowsListSort=async(
	e,
	setShowTrackedShowsSpinner,
	user,
	setTrackedShows,
	navigate
)=>{
	let trackedShowsBoxWrapper=document.querySelector('.tracker-tracked-shows-list-container-wrapper');
	let trackedShowsList=document.querySelector('.tracker-tracked-shows-list-container');
	e.preventDefault();
	makeAllInputAreasInert(true);
	setShowTrackedShowsSpinner(true);
	try{
		const data=await axios.post('/api/sortShows', {user});
		if(data.data.success===true){
			toast.success(<Toast icon='👍' messageParagraph={data.data.message[0]}/>, {icon: false});
			trackedShowsBoxWrapper.classList.add('tracker-tracked-shows-list-container-wrapper-flash');
			setTimeout(()=>{
				trackedShowsList.children[0]?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
			},200);
			setTimeout(()=>{
				trackedShowsBoxWrapper.classList.remove('tracker-tracked-shows-list-container-wrapper-flash');
			},150);
			useAddTrackedShowToState(setTrackedShows, data.data.returnedListOfTrackedShows.shows);
		}else{
			toast.error(<Toast icon='🤦‍♂️' icon2='🤦‍♀️' messageParagraphTwoIcons={data.data.error[0]}/>, {icon: false});
		};
	}catch(err){
		if(err.response.status && err.response.status===401){
			console.log('Caught 401 "unauthorized" error from handleTrackedShowsListSort in frontend Tracker.jsx', err);
			setShowTrackedShowsSpinner(false);
			makeAllInputAreasInert(false);
			unauthorized401Response(navigate);
		}else{
			console.log('Caught error from handleTrackedShowsListSort in frontend Tracker.jsx', err);
			const message='Something went wrong. :( Please try again later.';
			toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
		};
	};
	makeAllInputAreasInert(false);
	setShowTrackedShowsSpinner(false);
};

export default useHandleTrackedShowsListSort;
