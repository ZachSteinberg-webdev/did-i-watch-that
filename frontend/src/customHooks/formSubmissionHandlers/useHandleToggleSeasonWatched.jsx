import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import useUpdateWatchedEpisodesState from '../stateChanges/useUpdateWatchedEpisodesState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleToggleSeasonWatched=async(
	e,
	user,
	trackedShow,
	setWatchedEpisodes,
	watchedEpisodes,
	navigate
)=>{
	e.preventDefault();
	makeAllInputAreasInert(true);
	const seasonObjectId = e.target[0].value;
	try{
		const data=await axios.post('/api/toggleSeasonWatched', {user, seasonObjectId});
		if(data.data.success===true){
			const seasonNumber = data.data.season.seasonNumber;
			const seasonEpisodeObjectIdList = data.data.seasonEpisodeObjectIdList;
			if(data.data.seasonEpisodeObjectIdList.length===0){
				if(data.data.seasonPremiereDate===null){
					const message=`Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet. A premiere date has not yet been released. Keep checking back periodically for updated information.`;
					toast.success(<Toast icon='🐴' messageParagraph={message}/>, {icon: false});
				}else{
					const message=`Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet. Season ${seasonNumber} will begin airing on ${new Date(data.data.seasonPremiereDate).toLocaleDateString()}. Stay tuned!`;
					toast.success(<Toast icon='🐴' messageParagraph={message}/>, {icon: false});
				};
			}else{
				const watchedStatus = data.data.watchedStatus;
				const firstEpisodeOfSeasonNotAiredYet = data.data.firstEpisodeOfSeasonNotAiredYet;
				const firstEpisodeAirstamp = data.data.firstEpisodeAirstamp;
				const unwatchedEpisodes = data.data.unwatchedEpisodes;
				const episodesUpdatedToWatched = data.data.episodesUpdatedToWatched;
				if(watchedStatus==='unwatched'){
					useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, seasonEpisodeObjectIdList, watchedStatus);
					const message=`All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}.`;
					toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
				}else if(watchedStatus==='watched' && episodesUpdatedToWatched.length===unwatchedEpisodes.length){
					useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, episodesUpdatedToWatched, watchedStatus);
					const message=`All unwatched episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}.`;
					toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
				}else if(watchedStatus==='watched' && episodesUpdatedToWatched.length<unwatchedEpisodes.length){
					if(firstEpisodeOfSeasonNotAiredYet===false){
						useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, episodesUpdatedToWatched, watchedStatus);
						const message=`All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}, except those which have not aired yet.`;
						toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
					}else if(firstEpisodeOfSeasonNotAiredYet===true){
						if(!firstEpisodeAirstamp){
							const message=`Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet.`;
							toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
						}else{
							const message=`Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} doesn't premiere until ${new Date(data.data.season.seasonPremiereDate).toLocaleDateString()}.`;
							toast.success(<Toast icon='👍' messageParagraph={message}/>, {icon: false});
						};
					};
				};
			};
		};
	}catch(err){
		if(err.response && err.response.status===401){
			console.log('Caught 401 "unauthorized" error from handleToggleSeasonWatched in frontend Tracker.jsx', err);
			unauthorized401Response(navigate);
		}else{
			console.log('Caught error from handleToggleSeasonWatched in frontend Tracker.jsx', err);
			const message='Something went wrong. :( Please try again later.';
			toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
		};
	};
	makeAllInputAreasInert(false);
};

export default useHandleToggleSeasonWatched;
