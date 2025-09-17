import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import { toast } from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useHandleShowSubmit = async (e, setShowAddShowFormSpinner, setShowData, navigate) => {
	let suggestionBoxWrapper = document.querySelector('#tracker-show-add-suggestions-container-wrapper');
	let suggestionBox = document.querySelector('#tracker-show-add-suggestions-container');
	let trackerShowAddFormInput = document.querySelector('#tracker-show-add-form-input');
	e.preventDefault();
	makeAllInputAreasInert(true);
	setShowAddShowFormSpinner(true);
	const searchValue = e.target[0].value;
	suggestionBoxWrapper.style.display = 'flex';
	try {
		const data = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchValue}`);
		if (data.status >= 200 && data.status < 300) {
			setShowData(data.data);
		}
	} catch (err) {
		if (err.response.status && err.response.status === 401) {
			console.log('Caught 401 "unauthorized" error from handleShowSubmit in frontend Tracker.jsx', err);
			setShowAddShowFormSpinner(false);
			makeAllInputAreasInert(false);
			unauthorized401Response(navigate);
		} else {
			console.log('Caught error from Tracker.jsx handleShowSubmit block', err);
			const message =
				'The external resource that provides TV show data is currently unavailable. Please try again later.';
			toast.error(
				<Toast
					icon='⚠️'
					messageParagraph={message}
				/>,
				{
					icon: false
				}
			);
		}
	}
	setShowAddShowFormSpinner(false);
	makeAllInputAreasInert(false);
	setTimeout(() => {
		suggestionBox.childNodes[0]?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	}, 200);
	setTimeout(() => {
		trackerShowAddFormInput.focus({ focusVisible: true });
	}, 50);
};

export default useHandleShowSubmit;
