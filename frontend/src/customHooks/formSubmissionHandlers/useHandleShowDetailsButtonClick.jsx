import axios from 'axios';
import makeAllInputAreasInert from '../helperFunctions/makeAllInputAreasInert.jsx';
import unauthorized401Response from '../helperFunctions/unauthorized401Response.jsx';
import {toast} from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useHandleShowDetailsButtonClick=async(
	e,
	sanitizeHtml,
	setTrackedShowDetails,
	handleTrackedShowDetailsModalOpen,
	navigate
)=>{
	e.preventDefault();
	if(e.target.classList.contains('add-show-result-details-open-button')){
		const showDataObject=JSON.parse(e.target.value);
		const showData={};
		try{
			showData.showId=showDataObject.id;
			showData.showName=showDataObject.name;
			showData.showPremiereDate=showDataObject.premiered;
			showData.showEndedDate=showDataObject.ended;
			showData.showAverageRuntime=showDataObject.averageRuntime;
			showData.showRuntime=showDataObject.runtime;
			showData.showImdbId=showDataObject.externals.imdb;
			showData.showTheTvdbNumber=showDataObject.externals.thetvdb;
			showData.showGenres=showDataObject.genres;
			showData.showImageLink=showDataObject.image && showDataObject.image.original;
			showData.showLanguage=showDataObject.language;
			showData.showNetwork=showDataObject.network && showDataObject.network.name;
			showData.showNetworkWebsiteLink=showDataObject.network && showDataObject.network.officialSite;
			showData.showCountry=showDataObject.network && showDataObject.network.country.name;
			showData.showWebsiteLink=showDataObject.officialSite;
			showData.showAverageRating=showDataObject.rating.average;
			showData.showAirDays=showDataObject.schedule.days;
			showData.showAirTime=showDataObject.schedule.time;
			showData.showStatus=showDataObject.status;
			showData.showSummaryHtml=sanitizeHtml(showDataObject.summary, {allowedTags:['p'], allowedAttributes:{}});
			showData.showType=showDataObject.type;
			showData.showUpdatedEpoch=showDataObject.updated;
			showData.showWebChannelName=showDataObject.webChannel && showDataObject.webChannel.name;
			showData.showWebChannelWebsiteLink=showDataObject.webChannel && showDataObject.webChannel.officialSite;
			setTrackedShowDetails(showData);
			handleTrackedShowDetailsModalOpen();
		}catch(err){
			if(err.response && err.response.status===401){
				console.log('Caught 401 "unauthorized" error from handleShowDetailsButtonClick in frontend Tracker.jsx', err);
				unauthorized401Response(navigate);
			}else{
				console.log('Caught error from handleShowDetailsButtonClick in frontend Tracker.jsx', err);
				const message='Something went wrong. :( Please try again later.';
				toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
			};
		};
	}else{
		const showObjectId=e.target.value;
		try{
			const data=await axios.post('/api/getShowDetails', {showObjectId});
			if(data.data.success===true){
				setTrackedShowDetails(data.data.show);
				handleTrackedShowDetailsModalOpen();
			};
		}catch(err){
			if(err.response && err.response.status===401){
				console.log('Caught 401 "unauthorized" error from handleShowDetailsButtonClick in frontend Tracker.jsx', err);
				unauthorized401Response(navigate);
			}else{
				console.log('Caught error from handleShowDetailsButtonClick in frontend Tracker.jsx', err);
				const message='Something went wrong. :( Please try again later.';
				toast.error(<Toast icon='🙊' messageParagraph={message}/>, {icon: false});
			};
		};
	};
};

export default useHandleShowDetailsButtonClick;
