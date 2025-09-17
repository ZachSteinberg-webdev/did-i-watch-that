import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import { toast } from 'react-hot-toast';

import useRemoveTrackedShowFromState from '../stateChanges/useRemoveTrackedShowFromState.jsx';

import Toast from '../../components/Toast.jsx';

const useHandleTrackedShowDelete = async (
	e,
	setShowTrackedShowsSpinner,
	user,
	trackedShow,
	setTrackedShowSeasons,
	setTrackedShow,
	setTrackedShows,
	trackedShows,
	navigate
) => {
	e.preventDefault();
	makeAllInputAreasInert(true);
	setShowTrackedShowsSpinner(true);
	const showObjectId = e.target[0].value;
	const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
	try {
		if (guestMode) {
			const raw = localStorage.getItem('guestTrackedShows');
			const existing = raw ? JSON.parse(raw) : [];
			const next = existing.filter((s) => String(s._id) !== String(showObjectId));
			localStorage.setItem('guestTrackedShows', JSON.stringify(next));
			if (trackedShow._id === showObjectId) {
				setTrackedShowSeasons([]);
				setTrackedShow({});
			}
			toast.success(
				<Toast
					icon='👍'
					messageParagraph={'Show removed from your list.'}
				/>,
				{ icon: false }
			);
			useRemoveTrackedShowFromState(setTrackedShows, trackedShows, showObjectId);
		} else {
			const data = await axios.post('/api/deleteShow', { user, showObjectId });
			if (data.data.success === true) {
				if (trackedShow._id === showObjectId) {
					setTrackedShowSeasons([]);
					setTrackedShow({});
				}
				toast.success(
					<Toast
						icon='👍'
						messageParagraph={data.data.message[0]}
					/>,
					{ icon: false }
				);
				useRemoveTrackedShowFromState(setTrackedShows, trackedShows, showObjectId);
			} else {
				toast.error(
					<Toast
						icon='🤦‍♂️'
						icon2='🤦‍♀️'
						messageParagraphTwoIcons={data.data.error[0]}
					/>,
					{ icon: false }
				);
			}
		}
	} catch (err) {
		if (err.response.status && err.response.status === 401) {
			console.log('Caught 401 "unauthorized" error from handleTrackedShowDelete in frontend Tracker.jsx', err);
			setShowTrackedShowsSpinner(false);
			makeAllInputAreasInert(false);
			unauthorized401Response(navigate);
		} else {
			console.log('Caught error from handleTrackedShowDelete in frontend Tracker.jsx', err);
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
	makeAllInputAreasInert(false);
	setShowTrackedShowsSpinner(false);
};

export default useHandleTrackedShowDelete;
