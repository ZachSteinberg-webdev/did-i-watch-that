import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import { toast } from 'react-hot-toast';

import useUpdateWatchedEpisodesState from '../stateChanges/useUpdateWatchedEpisodesState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleEpisodeDetailsButtonClick = async (
	e,
	setHoveredEpisodeDetails,
	handleEpisodeDetailsModalOpen,
	navigate
) => {
	e.preventDefault();
	const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
	const episodeValue = e.target.value;
	try {
		if (guestMode) {
			// In guest mode, the value will be the episode JSON string if we adjust, but currently it's _id.
			// Try to parse JSON first; fallback to searching DOM for the episode button and reading value JSON
			let episodeObj;
			try {
				episodeObj = JSON.parse(episodeValue);
			} catch (_) {
				const btn = document.getElementById(`tracked-show-season-episode-button-${episodeValue}`);
				if (btn) {
					episodeObj = JSON.parse(btn.value);
				}
			}
			if (episodeObj) {
				const showRaw = localStorage.getItem('guestTrackedShows');
				const shows = showRaw ? JSON.parse(showRaw) : [];
				const currentShow = shows.find((s) => s.showName === episodeObj.showName);
				if (!episodeObj.episodeImageLink && currentShow?.showImageLink) {
					episodeObj.episodeImageLink = currentShow.showImageLink;
				}
				await setHoveredEpisodeDetails({
					showName: episodeObj.showName,
					seasonNumber: episodeObj.seasonNumber || episodeObj.season,
					episodeNumber: episodeObj.episodeNumber || episodeObj.number,
					episodeTitle: episodeObj.episodeTitle || episodeObj.name,
					episodeAirstamp: episodeObj.episodeAirstamp || episodeObj.airstamp,
					episodeRuntime: episodeObj.episodeRuntime || episodeObj.runtime,
					episodeRating: episodeObj.episodeRating || (episodeObj.rating && episodeObj.rating.average),
					episodeSummaryHtml: episodeObj.episodeSummaryHtml || episodeObj.summary,
					episodeImageLink: episodeObj.episodeImageLink || (episodeObj.image && episodeObj.image.original)
				});
				setTimeout(() => {
					handleEpisodeDetailsModalOpen();
				}, 300);
			}
		} else {
			const data = await axios.post('/api/getEpisodeDetails', {
				episodeObjectId: episodeValue
			});
			if (data.data.success === true) {
				if (data.data.episode.episodeImageLink) {
					await setHoveredEpisodeDetails(data.data.episode);
				} else if (data.data.show.showImageLink) {
					data.data.episode.episodeImageLink = data.data.show.showImageLink;
					await setHoveredEpisodeDetails(data.data.episode);
				} else {
					await setHoveredEpisodeDetails(data.data.episode);
				}
				setTimeout(() => {
					handleEpisodeDetailsModalOpen();
				}, 300);
			}
		}
	} catch (err) {
		if (err.response && err.response.status === 401) {
			console.log(
				'Caught 401 "unauthorized" error from handleToggleEpisodeWatched episodeDetailsButton in frontend Tracker.jsx',
				err
			);
			unauthorized401Response(navigate);
		} else {
			console.log('Caught error from handleToggleEpisodeWatched episodeDetailsButton in frontend Tracker.jsx', err);
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
};

export default useHandleEpisodeDetailsButtonClick;
