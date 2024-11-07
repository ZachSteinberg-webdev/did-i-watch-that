import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import useUpdateWatchedEpisodesState from '../stateChanges/useUpdateWatchedEpisodesState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleEpisodeDetailsButtonClick=async(
	e,
	setHoveredEpisodeDetails,
	handleEpisodeDetailsModalOpen,
	navigate
)=>{
	e.preventDefault();
	const episodeObjectId=e.target.value;
	try{
		const data=await axios.post('/api/getEpisodeDetails', {episodeObjectId});
		if(data.data.success===true){
			if(data.data.episode.episodeImageLink){
				await setHoveredEpisodeDetails(data.data.episode);
			}else if(data.data.show.showImageLink){
				data.data.episode.episodeImageLink=data.data.show.showImageLink;
				await setHoveredEpisodeDetails(data.data.episode);
			}else{
				await setHoveredEpisodeDetails(data.data.episode);
			};
			setTimeout(()=>{
				handleEpisodeDetailsModalOpen();
			},300);
		};
	}catch(err){
		if(err.response && err.response.status===401){
			console.log('Caught 401 "unauthorized" error from handleToggleEpisodeWatched episodeDetailsButton in frontend Tracker.jsx', err);
			unauthorized401Response(navigate);
		}else{
			console.log('Caught error from handleToggleEpisodeWatched episodeDetailsButton in frontend Tracker.jsx', err);
			const message='Something went wrong. :( Please try again later.';
			toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
		};
	};
};

export default useHandleEpisodeDetailsButtonClick;
