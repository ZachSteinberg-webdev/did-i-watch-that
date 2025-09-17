// -------------------------------------------------------------------------------------------------
// Module imports
// -------------------------------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import { toast } from 'react-hot-toast';
// -------------------------------------------------------------------------------------------------
// Helper function imports
// -------------------------------------------------------------------------------------------------
import makeAllInputAreasInert from '../customHooks/helperFunctions/makeAllInputAreasInert.jsx';
import makeTrackerPageInert from '../customHooks/helperFunctions/makeTrackerPageInert.jsx';
import focusActiveModalCloseButton from '../customHooks/helperFunctions/focusActiveModalCloseButton.jsx';
import focusShowDetailsModalCloseButton from '../customHooks/helperFunctions/focusShowDetailsModalCloseButton.jsx';
import focusEpisodeDetailsModalCloseButton from '../customHooks/helperFunctions/focusEpisodeDetailsModalCloseButton.jsx';
import focusActiveElement from '../customHooks/helperFunctions/focusActiveElement.jsx';
import preventPropagation from '../customHooks/helperFunctions/preventPropagation.jsx';
import unauthorized401Response from '../customHooks/helperFunctions/unauthorized401Response.jsx';
import toggleEpisodeWatchedClassList from '../customHooks/helperFunctions/toggleEpisodeWatchedClassList.jsx';
import useHandleEligibleElementFocus from '../customHooks/helperFunctions/useHandleEligibleElementFocus.jsx';
// -------------------------------------------------------------------------------------------------
// Data fetcher function imports
// -------------------------------------------------------------------------------------------------
import useGetUser from '../customHooks/dataFetchers/useGetUser.jsx';
import useGetShows from '../customHooks/dataFetchers/useGetShows.jsx';
// -------------------------------------------------------------------------------------------------
// Event listener function imports
// -------------------------------------------------------------------------------------------------
import useHandleKeyUp from '../customHooks/eventListeners/useHandleKeyUp.jsx';
import useHandleKeyDown from '../customHooks/eventListeners/useHandleKeyDown.jsx';
// -------------------------------------------------------------------------------------------------
// State change function imports
// -------------------------------------------------------------------------------------------------
import useHandleShowChange from '../customHooks/stateChanges/useHandleShowChange.jsx';
import useAddTrackedShowToState from '../customHooks/stateChanges/useAddTrackedShowToState.jsx';
import useRemoveTrackedShowFromState from '../customHooks/stateChanges/useRemoveTrackedShowFromState.jsx';
import useUpdateWatchedEpisodesState from '../customHooks/stateChanges/useUpdateWatchedEpisodesState.jsx';
import useUpdateEpisodeModalCloseButton from '../customHooks/stateChanges/useUpdateEpisodeModalCloseButton.jsx';
// -------------------------------------------------------------------------------------------------
// Modal open and close function imports
// -------------------------------------------------------------------------------------------------
import useHandleShowAddInstructionsModalOpen from '../customHooks/modalOpenHandlers/useHandleShowAddInstructionsModalOpen.jsx';
import useHandleShowAddInstructionsModalClose from '../customHooks/modalCloseHandlers/useHandleShowAddInstructionsModalClose.jsx';
import useHandleTrackedShowsInstructionsModalOpen from '../customHooks/modalOpenHandlers/useHandleTrackedShowsInstructionsModalOpen.jsx';
import useHandleTrackedShowsInstructionsModalClose from '../customHooks/modalCloseHandlers/useHandleTrackedShowsInstructionsModalClose.jsx';
import useHandleTrackedShowInstructionsModalOpen from '../customHooks/modalOpenHandlers/useHandleTrackedShowInstructionsModalOpen.jsx';
import useHandleTrackedShowInstructionsModalClose from '../customHooks/modalCloseHandlers/useHandleTrackedShowInstructionsModalClose.jsx';
import useHandleTrackedShowDetailsModalOpen from '../customHooks/modalOpenHandlers/useHandleTrackedShowDetailsModalOpen.jsx';
import useHandleTrackedShowDetailsModalClose from '../customHooks/modalCloseHandlers/useHandleTrackedShowDetailsModalClose.jsx';
import useHandleEpisodeDetailsModalOpen from '../customHooks/modalOpenHandlers/useHandleEpisodeDetailsModalOpen.jsx';
import useHandleEpisodeDetailsModalClose from '../customHooks/modalCloseHandlers/useHandleEpisodeDetailsModalClose.jsx';
// -------------------------------------------------------------------------------------------------
// Form submission function imports
// -------------------------------------------------------------------------------------------------
import useHandleShowSubmit from '../customHooks/formSubmissionHandlers/useHandleShowSubmit.jsx';
import useHandleAddedShowSubmit from '../customHooks/formSubmissionHandlers/useHandleAddedShowSubmit.jsx';
import useHandleTrackedShowDelete from '../customHooks/formSubmissionHandlers/useHandleTrackedShowDelete.jsx';
import useHandleTrackedShowsListSort from '../customHooks/formSubmissionHandlers/useHandleTrackedShowsListSort.jsx';
import useHandleShowLoad from '../customHooks/formSubmissionHandlers/useHandleShowLoad.jsx';
import useHandleToggleEpisodeWatched from '../customHooks/formSubmissionHandlers/useHandleToggleEpisodeWatched.jsx';
import useHandleToggleSeasonWatched from '../customHooks/formSubmissionHandlers/useHandleToggleSeasonWatched.jsx';
import useHandleEpisodeDetailsButtonClick from '../customHooks/formSubmissionHandlers/useHandleEpisodeDetailsButtonClick.jsx';
import useHandleShowDetailsButtonClick from '../customHooks/formSubmissionHandlers/useHandleShowDetailsButtonClick.jsx';
// -------------------------------------------------------------------------------------------------
// Component imports
// -------------------------------------------------------------------------------------------------
import Toast from '../components/Toast.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import GuestBanner from '../components/GuestBanner.jsx';
import Spinner from '../components/Spinner.jsx';
import TrackerInstructionsShowAdd from '../components/TrackerInstructionsShowAdd.jsx';
import TrackerInstructionsTrackedShows from '../components/TrackerInstructionsTrackedShows.jsx';
import TrackerInstructionsTrackedShow from '../components/TrackerInstructionsTrackedShow.jsx';
import AddShowSection from '../components/AddShowSection.jsx';
import TrackedShowsSection from '../components/TrackedShowsSection.jsx';
import TrackedShowSection from '../components/TrackedShowSection.jsx';
import TrackedShowDetails from '../components/TrackedShowDetails.jsx';
import TrackedShowEpisodeDetails from '../components/TrackedShowEpisodeDetails.jsx';
// -------------------------------------------------------------------------------------------------
// CSS imports
// -------------------------------------------------------------------------------------------------
import '../css/Tracker.css';
// -------------------------------------------------------------------------------------------------
// Component definition
// -------------------------------------------------------------------------------------------------
export default function Tracker() {
	// -------------------------------------------------------------------------------------------------
	// React hooks
	// -------------------------------------------------------------------------------------------------
	const navigate = useNavigate();
	// -------------------------------------------------------------------------------------------------
	// State declarations
	// -------------------------------------------------------------------------------------------------
	const [user, setUser] = useState({ name: '', email: '' });
	const [show, setShow] = useState('');
	const [showData, setShowData] = useState(null);
	const [addedShow, setAddedShow] = useState();
	const [trackedShows, setTrackedShows] = useState();
	const [trackedShow, setTrackedShow] = useState({});
	const [trackedShowSeasons, setTrackedShowSeasons] = useState([]);
	const [watchedEpisodes, setWatchedEpisodes] = useState([]);
	const [hoveredEpisodeShowDetails, setHoveredEpisodeShowDetails] = useState({});
	const [trackedShowDetails, setTrackedShowDetails] = useState({});
	const [hoveredEpisodeDetails, setHoveredEpisodeDetails] = useState({});
	const [showAddShowFormSpinner, setShowAddShowFormSpinner] = useState(false);
	const [showTrackedShowsSpinner, setShowTrackedShowsSpinner] = useState(false);
	const [showTrackedShowSpinner, setShowTrackedShowSpinner] = useState(false);
	const [activeElement, setActiveElement] = useState(null);
	const [trackerInstructionsShowAddModalOpen, setTrackerInstructionsShowAddModalOpen] = useState(false);
	const [trackerInstructionsTrackedShowsModalOpen, setTrackerInstructionsTrackedShowsModalOpen] = useState(false);
	const [trackerInstructionsTrackedShowModalOpen, setTrackerInstructionsTrackedShowModalOpen] = useState(false);
	const [trackedShowDetailsModalOpen, setTrackedShowDetailsModalOpen] = useState(false);
	const [trackedShowEpisodeDetailsModalOpen, setTrackedShowEpisodeDetailsModalOpen] = useState(false);
	const [episodeModalOpenButtonClicked, setEpisodeModalOpenButtonClicked] = useState(false);
	const [episodeModalCloseButton, setEpisodeModalCloseButton] = useState(null);
	// -------------------------------------------------------------------------------------------------
	// Keyboard shortcut event listeners
	// -------------------------------------------------------------------------------------------------
	useHandleKeyUp();
	useHandleKeyDown();
	// -------------------------------------------------------------------------------------------------
	// State change functions
	// -------------------------------------------------------------------------------------------------
	const updateEpisodeModalCloseButton = (button) => {
		useUpdateEpisodeModalCloseButton(
			setEpisodeModalCloseButton,
			episodeModalOpenButtonClicked,
			focusEpisodeDetailsModalCloseButton,
			button
		);
	};
	const handleShowChange = useHandleShowChange(setShow);
	// -------------------------------------------------------------------------------------------------
	// Modal open and close functions
	// -------------------------------------------------------------------------------------------------
	const handleShowAddInstructionsModalOpen = () => {
		useHandleShowAddInstructionsModalOpen(
			setTrackerInstructionsShowAddModalOpen,
			makeTrackerPageInert,
			focusActiveModalCloseButton
		);
	};
	const handleShowAddInstructionsModalClose = () => {
		useHandleShowAddInstructionsModalClose(
			setTrackerInstructionsShowAddModalOpen,
			makeTrackerPageInert,
			focusActiveElement,
			activeElement
		);
	};
	const handleTrackedShowsInstructionsModalOpen = () => {
		useHandleTrackedShowsInstructionsModalOpen(
			setTrackerInstructionsTrackedShowsModalOpen,
			makeTrackerPageInert,
			focusActiveModalCloseButton
		);
	};
	const handleTrackedShowsInstructionsModalClose = () => {
		useHandleTrackedShowsInstructionsModalClose(
			setTrackerInstructionsTrackedShowsModalOpen,
			makeTrackerPageInert,
			focusActiveElement,
			activeElement
		);
	};
	const handleTrackedShowInstructionsModalOpen = () => {
		useHandleTrackedShowInstructionsModalOpen(
			setTrackerInstructionsTrackedShowModalOpen,
			makeTrackerPageInert,
			focusActiveModalCloseButton
		);
	};
	const handleTrackedShowInstructionsModalClose = () => {
		useHandleTrackedShowInstructionsModalClose(
			setTrackerInstructionsTrackedShowModalOpen,
			makeTrackerPageInert,
			focusActiveElement,
			activeElement
		);
	};
	const handleTrackedShowDetailsModalOpen = () => {
		useHandleTrackedShowDetailsModalOpen(
			setTrackedShowDetailsModalOpen,
			makeTrackerPageInert,
			focusShowDetailsModalCloseButton
		);
	};
	const handleTrackedShowDetailsModalClose = () => {
		useHandleTrackedShowDetailsModalClose(
			setTrackedShowDetailsModalOpen,
			makeTrackerPageInert,
			focusActiveElement,
			activeElement
		);
	};
	const handleEpisodeDetailsModalOpen = () => {
		useHandleEpisodeDetailsModalOpen(
			setTrackedShowEpisodeDetailsModalOpen,
			makeTrackerPageInert,
			setEpisodeModalOpenButtonClicked
		);
	};
	const handleEpisodeDetailsModalClose = () => {
		useHandleEpisodeDetailsModalClose(
			episodeModalCloseButton,
			setEpisodeModalOpenButtonClicked,
			makeTrackerPageInert,
			setTrackedShowEpisodeDetailsModalOpen,
			focusActiveElement,
			activeElement
		);
	};
	// -------------------------------------------------------------------------------------------------
	// Form submission functions
	// -------------------------------------------------------------------------------------------------
	const handleShowSubmit = (e) => {
		useHandleShowSubmit(e, setShowAddShowFormSpinner, setShowData, navigate);
	};
	const handleAddedShowSubmit = (e) => {
		useHandleAddedShowSubmit(e, setShowTrackedShowsSpinner, user, setTrackedShows, navigate);
	};
	const handleTrackedShowDelete = (e) => {
		useHandleTrackedShowDelete(
			e,
			setShowTrackedShowsSpinner,
			user,
			trackedShow,
			setTrackedShowSeasons,
			setTrackedShow,
			setTrackedShows,
			trackedShows,
			navigate
		);
	};
	const handleTrackedShowsListSort = (e) => {
		useHandleTrackedShowsListSort(e, setShowTrackedShowsSpinner, user, setTrackedShows, navigate);
	};
	const handleShowLoad = (e) => {
		useHandleShowLoad(
			e,
			trackedShow,
			setShowTrackedShowSpinner,
			setTrackedShowSeasons,
			setTrackedShow,
			user,
			setWatchedEpisodes,
			navigate
		);
	};
	const handleToggleEpisodeWatched = (e) => {
		useHandleToggleEpisodeWatched(e, user, setWatchedEpisodes, watchedEpisodes, trackedShow, navigate);
	};
	const handleToggleSeasonWatched = (e) => {
		useHandleToggleSeasonWatched(e, user, trackedShow, setWatchedEpisodes, watchedEpisodes, navigate);
	};
	const handleEpisodeDetailsButtonClick = (e) => {
		useHandleEpisodeDetailsButtonClick(e, setHoveredEpisodeDetails, handleEpisodeDetailsModalOpen, navigate);
	};
	const handleShowDetailsButtonClick = (e) => {
		useHandleShowDetailsButtonClick(
			e,
			sanitizeHtml,
			setTrackedShowDetails,
			handleTrackedShowDetailsModalOpen,
			navigate
		);
	};
	// -------------------------------------------------------------------------------------------------
	// useEffect declarations
	// -------------------------------------------------------------------------------------------------
	useEffect(() => {
		useGetUser(setUser, navigate);
	}, []);
	useEffect(() => {
		useGetShows(setTrackedShows);
	}, []);
	useEffect(() => {
		useHandleEligibleElementFocus(setActiveElement);
	});
	// -------------------------------------------------------------------------------------------------
	// Returned JSX code
	// -------------------------------------------------------------------------------------------------
	return (
		<>
			<Header />
			<GuestBanner />
			{trackerInstructionsShowAddModalOpen && (
				<TrackerInstructionsShowAdd
					handleShowAddInstructionsModalClose={handleShowAddInstructionsModalClose}
					preventPropagation={preventPropagation}
				/>
			)}
			{trackerInstructionsTrackedShowsModalOpen && (
				<TrackerInstructionsTrackedShows
					handleTrackedShowsInstructionsModalClose={handleTrackedShowsInstructionsModalClose}
					preventPropagation={preventPropagation}
				/>
			)}
			{trackerInstructionsTrackedShowModalOpen && (
				<TrackerInstructionsTrackedShow
					handleTrackedShowInstructionsModalClose={handleTrackedShowInstructionsModalClose}
					preventPropagation={preventPropagation}
				/>
			)}
			{trackedShowDetailsModalOpen && (
				<TrackedShowDetails
					trackedShowDetails={trackedShowDetails}
					handleTrackedShowDetailsModalClose={handleTrackedShowDetailsModalClose}
					preventPropagation={preventPropagation}
				/>
			)}
			{trackedShowEpisodeDetailsModalOpen && (
				<TrackedShowEpisodeDetails
					hoveredEpisodeDetails={hoveredEpisodeDetails}
					handleEpisodeDetailsModalClose={handleEpisodeDetailsModalClose}
					updateEpisodeModalCloseButton={updateEpisodeModalCloseButton}
					preventPropagation={preventPropagation}
				/>
			)}
			<div id='tracker-page'>
				<div id='tracker-forms-container'>
					<div id='tracker-show-add-form-container'>
						<AddShowSection
							showData={showData}
							handleShowChange={handleShowChange}
							handleShowSubmit={handleShowSubmit}
							handleAddedShowSubmit={handleAddedShowSubmit}
							showAddShowFormSpinner={showAddShowFormSpinner}
							handleShowAddInstructionsModalOpen={handleShowAddInstructionsModalOpen}
							handleShowDetailsButtonClick={handleShowDetailsButtonClick}
						/>
					</div>
					<div id='tracker-tracked-shows-container'>
						<TrackedShowsSection
							user={user}
							trackedShows={trackedShows}
							handleTrackedShowDelete={handleTrackedShowDelete}
							handleTrackedShowsListSort={handleTrackedShowsListSort}
							handleShowLoad={handleShowLoad}
							showTrackedShowsSpinner={showTrackedShowsSpinner}
							handleTrackedShowsInstructionsModalOpen={handleTrackedShowsInstructionsModalOpen}
							handleShowDetailsButtonClick={handleShowDetailsButtonClick}
						/>
					</div>
					<div id='tracker-tracked-show-container'>
						<TrackedShowSection
							user={user}
							trackedShow={trackedShow}
							trackedShowSeasons={trackedShowSeasons}
							handleToggleEpisodeWatched={handleToggleEpisodeWatched}
							watchedEpisodes={watchedEpisodes}
							handleToggleSeasonWatched={handleToggleSeasonWatched}
							showTrackedShowSpinner={showTrackedShowSpinner}
							handleTrackedShowInstructionsModalOpen={handleTrackedShowInstructionsModalOpen}
							handleShowDetailsButtonClick={handleShowDetailsButtonClick}
							handleEpisodeDetailsButtonClick={handleEpisodeDetailsButtonClick}
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
