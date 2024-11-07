import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import toggleEpisodeWatchedClassList from '../helperFunctions/toggleEpisodeWatchedClassList.jsx';
import useUpdateWatchedEpisodesState from '../stateChanges/useUpdateWatchedEpisodesState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleToggleEpisodeWatched=async(
	e,
	user,
	setWatchedEpisodes,
	watchedEpisodes,
	trackedShow,
	navigate
)=>{
	e.preventDefault();
	const episodeJsonString = e.target[0].value;
	const episodeJsonObject = await JSON.parse(episodeJsonString);
	const episodeObjectId=episodeJsonObject._id;
	const episodeAirstamp=new Date(episodeJsonObject.episodeAirstamp);
	const currentDatestamp=new Date();
	if(episodeAirstamp>=currentDatestamp){
		const seasonNumber = episodeJsonObject.seasonNumber;
		const episodeNumber = episodeJsonObject.episodeNumber;
		const message=`Whoa there! Hold your horses! S${String(seasonNumber).padStart(2,'0')}E${String(episodeNumber).padStart(2,'0')} hasn't aired yet!`;
		toast.success(<Toast icon='🐴' messageParagraph={message}/>, {icon: false});
	}else{
		const episodeButton=e.target[0];
		const showEpisodeDetailsButtonSvgPath = e.target[2].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
		toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
		try{
			const data=await axios.post('/api/toggleEpisodeWatched', {user, episodeObjectId});
			if(data.data.success===true){
				const seasonNumber = data.data.episode.seasonNumber;
				const episodeNumber = data.data.episode.episodeNumber;
				const episodeTitle = data.data.episode.episodeTitle;
				const episodeObjectId = data.data.episode._id;
				const watchedStatus = data.data.watchedStatus;
				useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, [episodeObjectId]); // Deactivated because it was causing all episode buttons to re-render, which was massively increasing the time it takes for an episode button to be turned green in the GUI, causing appearance of lagginess. UPDATE: ended up needing to reactivate it because it is needed in order for the toggleSeasonWatched hook to work correctly. Without it, the episode's watched status doesn't get updated in state, and therefore when toggleSeasonWatched fires, if an episode was marked as watched individually, then if the whole season is marked as watched, and then as unwatched, the toggleSeasonWatched hook doesn't know that the individually-marked episodes has been marked as watched, and it therefore doesn't get included in the toggleSeasonWatched "unwatched" action. UPDATE 2: Solved lagginess by building an episode button component, so that only the episode button that changes needs to re-render instead of all episode buttons re-rendering anytime one of them changes.
				const message=`${trackedShow.showName} S${String(seasonNumber).padStart(2,'0')}E${String(episodeNumber).padStart(2,'0')}, "${episodeTitle}", has been marked as ${watchedStatus}.`;
				toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
			}
		}catch(err){
			if(err.response && err.response.status===401){
				toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
				console.log('Caught 401 "unauthorized" error from handleToggleEpisodeWatched in frontend Tracker.jsx', err);
				unauthorized401Response(navigate);
			}else{
				toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
				console.log('Caught error from handleToggleEpisodeWatched in frontend Tracker.jsx', err);
				const message='Something went wrong. :( Please try again later.';
				toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
			};
		};
	};
};

export default useHandleToggleEpisodeWatched;
