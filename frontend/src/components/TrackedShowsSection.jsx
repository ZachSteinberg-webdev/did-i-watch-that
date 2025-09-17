import React from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import Toast from '../components/Toast.jsx';
import TrackerSectionHeader from '../components/TrackerSectionHeader.jsx';
import Spinner from '../components/Spinner.jsx';
import ShowButtonFormAndDeleteForm from '../components/ShowButtonFormAndDeleteForm.jsx';
import ShowButtonForm from '../components/ShowButtonForm.jsx';
import InfoButtonDummy from '../components/InfoButtonDummy.jsx';
import InfoButton from '../components/InfoButton.jsx';
import ShowButtonDeleteForm from '../components/ShowButtonDeleteForm.jsx';

import '../css/TrackedShowsSection.css';

export default function TrackedShowsSection({
	user,
	trackedShows,
	handleTrackedShowDelete,
	handleTrackedShowsListSort,
	handleShowLoad,
	showTrackedShowsSpinner,
	handleTrackedShowsInstructionsModalOpen,
	handleShowDetailsButtonClick,
	handleKeyUp
}) {
	return (
		<>
			<TrackerSectionHeader
				sectionHeaderId={'tracker-tracked-shows-header-container'}
				infoButtonDummyClassName={'tracked-shows-instructions-dummy-button'}
				sectionHeaderParagraphId={'tracker-tracked-shows-header'}
				sectionHeaderParagraphText={['Tracked', 'Shows']}
				infoButtonId={'tracked-shows-instructions-open-button'}
				infoButtonOnClick={handleTrackedShowsInstructionsModalOpen}
				infoButtonSvgId={'tracker-instructions-open-button-icon'}
				infoButtonFontPathClassName={'tracker-instructions-open-button-icon-font'}
				infoButtonFontColor={'var(--svg-font-color-info-button-instructions)'}
				infoButtonPathClassName={'tracked-shows-instructions-open-button-path'}
				infoButtonPathFillColor={'#5460F7'}
			/>
			<form
				className='tracker-tracked-shows-list-sort-form'
				onSubmit={handleTrackedShowsListSort}
			>
				<button
					className='tracker-tracked-shows-list-sort-button eligible-click-element'
					type='submit'
				>
					Sort alphabetically
				</button>
				<button
					className='tracker-tracked-shows-list-sort-button-small eligible-click-element'
					type='submit'
				>
					Sort A→Z
				</button>
			</form>
			<div
				className='tracker-tracked-shows-list-container-wrapper'
				tabIndex='-1'
				onKeyUp={handleKeyUp}
			>
				{showTrackedShowsSpinner && <Spinner spinnerClassName={'tracked-shows-spinner'} />}
				<div
					className='tracker-tracked-shows-list-container'
					tabIndex='-1'
				>
					{trackedShows === undefined && <Spinner />}
					{trackedShows !== undefined && trackedShows.length === 0 ? (
						<>
							<p id='tracker-tracked-shows-list-header'>You haven't tracked any shows yet!</p>
							<small className='tracker-tracked-shows-list-instructions'>
								To start tracking shows, use the "Add a show" form to the left.
							</small>
						</>
					) : (
						<>
							{trackedShows !== undefined &&
								trackedShows.map((trackedShow, index) => {
									return (
										<ShowButtonFormAndDeleteForm
											showButtonFormAndDeleteFormClassName={
												'tracker-tracked-show-list-button-and-delete-button-wrapper'
											}
											showButtonFormAndDeleteFormId={`tracker-tracked-show-list-button-and-delete-button-wrapper-${index}`}
											key={`tracker-tracked-show-list-button-and-delete-button-${trackedShow.showId}`}
										>
											<div className='tracker-tracked-show-list-button-and-delete-button-container'>
												<ShowButtonForm
													showFormClassName={'show-list-form'}
													showFormId={`show-list-form-${index}`}
													showFormKey={`show-list-form-${trackedShow.showId}`}
													showFormOnSubmit={handleShowLoad}
													showButtonClassName={'show-list-button eligible-click-element'}
													showButtonId={`show-list-button-${index}`}
													showButtonType={'submit'}
													showButtonValue={trackedShow._id}
													infoButtonDummyClassName={'show-list-details-dummy-button'}
													showButtonOuterDivClassName={'show-list-button-show-name-and-premeire-date-container'}
													showButtonInnerDivClassName={'show-list-button-show-name'}
													showButtonShowName={trackedShow.showName}
													showButtonPremiereDateClassName={'show-list-button-show-premeire-date'}
													showButtonPremiereDateSmallClassName={'show-list-button-show-premeire-date-small'}
													showButtonPremiereDate={trackedShow.showPremiereDate}
													infoButtonClassName={'show-list-details-open-button eligible-click-element'}
													infoButtonValue={trackedShow._id}
													infoButtonType={'submit'}
													infoButtonOnClick={handleShowDetailsButtonClick}
													infoButtonFontPathClassName={'tracker-details-open-button-icon-font'}
													infoButtonFontColor={'var(--svg-font-color-info-button-details)'}
													infoButtonSvgClassName={'show-list-details-open-button-svg'}
													infoButtonPathClassName={'show-list-details-open-button-path'}
													infoButtonPathFillColor={'#A7A7A7'}
												/>
												<ShowButtonDeleteForm
													showFormDeleteClassName={'show-list-delete-form'}
													showFormDeleteId={`show-list-delete-form-${index}`}
													showFormDeleteOnSubmit={handleTrackedShowDelete}
													showButtonDeleteClassName={'show-list-delete-button eligible-click-element'}
													showButtonDeleteId={`show-list-delete-button-${index}`}
													showButtonDeleteType={'submit'}
													showButtonDeleteValue={trackedShow._id}
													showButtonDeleteCharacter={'&#x232B;'}
												/>
											</div>
										</ShowButtonFormAndDeleteForm>
									);
								})}
						</>
					)}
				</div>
			</div>
		</>
	);
}
