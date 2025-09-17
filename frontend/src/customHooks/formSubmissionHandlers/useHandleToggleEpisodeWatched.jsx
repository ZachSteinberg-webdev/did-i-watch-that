import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import { toast } from 'react-hot-toast';

import toggleEpisodeWatchedClassList from '../helperFunctions/toggleEpisodeWatchedClassList.jsx';
import useUpdateWatchedEpisodesState from '../stateChanges/useUpdateWatchedEpisodesState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleToggleEpisodeWatched = async (e, user, setWatchedEpisodes, watchedEpisodes, trackedShow, navigate) => {
	e.preventDefault();
	const episodeJsonString = e.target[0].value;
	const episodeJsonObject = await JSON.parse(episodeJsonString);
	const episodeObjectId = episodeJsonObject._id;
	const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
	const episodeAirstamp = new Date(episodeJsonObject.episodeAirstamp || episodeJsonObject.airstamp);
	const currentDatestamp = new Date();
	if (episodeAirstamp >= currentDatestamp) {
		const seasonNumber = episodeJsonObject.seasonNumber || episodeJsonObject.season;
		const episodeNumber = episodeJsonObject.episodeNumber || episodeJsonObject.number;
		const message = `Whoa there! Hold your horses! S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')} hasn't aired yet!`;
		toast.success(
			<Toast
				icon='🐴'
				messageParagraph={message}
			/>,
			{
				icon: false
			}
		);
	} else {
		const episodeButton = e.target[0];
		const showEpisodeDetailsButtonSvgPath =
			e.target[2].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild
				.firstChild;
		toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
		try {
			if (guestMode) {
				// Update local watched map
				const watchedMapRaw = localStorage.getItem('guestWatchedEpisodes');
				const watchedMap = watchedMapRaw ? JSON.parse(watchedMapRaw) : {};
				const showKey = trackedShow.showId || trackedShow._id;
				let arr = watchedMap[showKey] || [];
				if (arr.includes(episodeObjectId)) {
					arr = arr.filter((id) => id !== episodeObjectId);
				} else {
					arr = [...arr, episodeObjectId];
				}
				watchedMap[showKey] = arr;
				localStorage.setItem('guestWatchedEpisodes', JSON.stringify(watchedMap));
				useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, [episodeObjectId]);
				const seasonNumber = episodeJsonObject.seasonNumber || episodeJsonObject.season;
				const episodeNumber = episodeJsonObject.episodeNumber || episodeJsonObject.number;
				const episodeTitle = episodeJsonObject.episodeTitle || episodeJsonObject.name;
				const watchedStatus = arr.includes(episodeObjectId) ? 'watched' : 'unwatched';
				const message = `${trackedShow.showName} S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}, "${episodeTitle}", has been marked as ${watchedStatus}.`;
				toast.success(
					<Toast
						icon='👍'
						messageParagraph={message}
					/>,
					{
						icon: false
					}
				);
			} else {
				const data = await axios.post('/api/toggleEpisodeWatched', {
					user,
					episodeObjectId
				});
				if (data.data.success === true) {
					const seasonNumber = data.data.episode.seasonNumber;
					const episodeNumber = data.data.episode.episodeNumber;
					const episodeTitle = data.data.episode.episodeTitle;
					const episodeObjectId = data.data.episode._id;
					const watchedStatus = data.data.watchedStatus;
					useUpdateWatchedEpisodesState(setWatchedEpisodes, watchedEpisodes, [episodeObjectId]);
					const message = `${trackedShow.showName} S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}, "${episodeTitle}", has been marked as ${watchedStatus}.`;
					toast.success(
						<Toast
							icon='👍'
							messageParagraph={message}
						/>,
						{
							icon: false
						}
					);
				}
			}
		} catch (err) {
			if (err.response && err.response.status === 401) {
				toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
				console.log('Caught 401 "unauthorized" error from handleToggleEpisodeWatched in frontend Tracker.jsx', err);
				unauthorized401Response(navigate);
			} else {
				toggleEpisodeWatchedClassList([episodeButton, showEpisodeDetailsButtonSvgPath]);
				console.log('Caught error from handleToggleEpisodeWatched in frontend Tracker.jsx', err);
				const message = 'Something went wrong. :( Please try again later.';
				toast.error(
					<Toast
						icon='🙊'
						messageParagraph={message}
					/>,
					{
						icon: false
					}
				);
			}
		}
	}
};

export default useHandleToggleEpisodeWatched;
