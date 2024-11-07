import React, {Fragment, useRef} from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';

import Toast from '../components/Toast.jsx';
import TrackerSectionHeader from '../components/TrackerSectionHeader.jsx';
import Spinner from '../components/Spinner.jsx';
import Tippy from '@tippyjs/react';
import EpisodeButtonForm from '../components/EpisodeButtonForm.jsx';
import InfoButtonDummy from '../components/InfoButtonDummy.jsx';
import InfoButton from '../components/InfoButton.jsx';

import '../css/TrackedShowSection.css';
import '../css/Tippy.css';
import 'tippy.js/animations/scale.css';

export default function TrackedShowSection({
	user,
	trackedShow,
	trackedShowSeasons,
	handleToggleEpisodeWatched,
	handleEpisodeTileMouseOver,
	handleEpisodeTileMouseOut,
	hoveredEpisodeTile,
	watchedEpisodes,
	handleToggleSeasonWatched,
	showTrackedShowSpinner,
	handleTrackedShowInstructionsModalOpen,
	handleShowDetailsButtonClick,
	handleEpisodeDetailsButtonClick,
	handleKeyUp
}){
	const ref=useRef(null);
	return(
		<>
			<TrackerSectionHeader
				sectionHeaderId={'tracker-tracked-show-header-container'}
				infoButtonDummyClassName={'tracked-show-instructions-dummy-button'}
				sectionHeaderParagraphId={'tracker-tracked-show-header'}
				sectionHeaderParagraphText={['Show','Tracker']}
				infoButtonId={'tracked-show-instructions-open-button'}
				infoButtonOnClick={handleTrackedShowInstructionsModalOpen}
				infoButtonSvgId={'tracked-show-instructions-open-button-icon'}
				infoButtonFontPathClassName={'tracker-instructions-open-button-icon-font'}
				infoButtonFontColor={'var(--svg-font-color-info-button-instructions)'}
				infoButtonPathClassName={'tracked-show-instructions-open-button-path'}
				infoButtonPathFillColor={'#5460F7'}
			/>
			<div className='tracked-show-header'>
				{trackedShow.showName && <InfoButtonDummy
					infoButtonDummyClassName={'tracked-show-details-dummy-button'}
					/>}
				<div className='tracked-show-header-show-name'>{trackedShow.showName ?
						<>{trackedShow.showName}</>
						:
						<>No show selected</>
					}
				</div>
				{trackedShow.showName && <InfoButton
					infoButtonClassName={'tracked-show-details-open-button'}
					infoButtonValue={trackedShow._id}
					infoButtonType={'submit'}
					infoButtonOnClick={handleShowDetailsButtonClick}
					infoButtonFontPathClassName={'tracker-details-open-button-icon-font'}
					infoButtonFontColor={'var(--svg-font-color-info-button-details)'}
					infoButtonSvgClassName={'tracked-show-details-open-button-svg'}
					infoButtonPathClassName={'tracked-show-details-open-button-path'}
					infoButtonPathFillColor={'#A7A7A7'}
				/>}
			</div>
			<div className='tracker-tracked-show-list-container-wrapper' tabIndex='-1' onKeyUp={handleKeyUp}>
				<div className='tracker-tracked-show-list-container' tabIndex='-1'>
					{showTrackedShowSpinner && <Spinner spinnerClassName={'tracked-show-spinner'}/>}
					{trackedShow.showName?
						trackedShow.showStatus==='In Development'?
							<div className='no-show-selected-text-container'>
								<div className='no-show-selected-text'>
									{`${trackedShow.showName} is currently in development and has not begun airing yet.`}
								</div>
								{trackedShow.showPremiereDate &&
									<div className='no-show-selected-text'>
										{`It is scheduled to premiere on ${new Date(trackedShow.showPremiereDate).toLocaleDateString()}`} {trackedShow.showAirTime && ` at ${new Date(trackedShow.showPremiereDate+'T'+trackedShow.showAirTime+'Z').toLocaleTimeString()}`}.
									</div>
								}
								{!trackedShow.showPremiereDate &&
									<>
										<div className='no-show-selected-text'>
											A premiere date has not yet been released.
										</div>
										<div className='no-show-selected-text'>
											Keep checking back for updated information!
										</div>
									</>
								}
							</div>:
						<div className='tracked-show-seasons'>
							{trackedShowSeasons[0] && trackedShowSeasons.map((trackedShowSeason, seasonIndex)=>{
								return(
									<Fragment key={`season-row-fragment-${trackedShowSeason.seasonNumber}`}>
										<div className='tracked-show-season-row' id={`season-row-${trackedShowSeason.seasonNumber}`} key={`season-row-${trackedShowSeason.seasonNumber}`}>
											<form className='tracked-show-season-number-container' id={`season-form-${trackedShowSeason.seasonNumber}`} key={`season-form-${trackedShowSeason.seasonNumber}`} onSubmit={handleToggleSeasonWatched}>
												<button className='tracked-show-season-number eligible-click-element' id={`season-button-${trackedShowSeason.seasonNumber}`} key={`season-button-${trackedShowSeason.seasonNumber}`} type='submit' value={trackedShowSeason._id}>
													Season {trackedShowSeason.seasonNumber}
												</button>
											</form>
											<div className='tracked-show-season-episodes-container' key={`tracked-show-season-episodes-container-${trackedShowSeason.seasonNumber}`}>
												{trackedShowSeason.episodeObjectIds.map((episode, episodeIndex)=>{
													return(
														<Fragment
															key={`episode-fragment-${episode._id}`}
														>
															<Tippy
																key={`tippy-${episode._id}`}
																delay={[50,50]}
																placement={'bottom'}
																theme={'tippy-theme'}
																animation={'scale'}
																trigger={'mouseenter'}
																hideOnClick={false}
																maxWidth={'20rem'}
																zIndex={2}
																content=
																	{<div>
																			<p className='tippy-title'>Episode Title:</p>
																			<p className='tippy-episode-title'>"{episode.episodeTitle}"</p>
																		</div>
																	}
															>
																<EpisodeButtonForm
																	ref={ref}
																	episodeButtonFormClassName={'tracked-show-season-episode-container'}
																	episodeButtonFormId={`episode-${episode._id}`}
																	episodeButtonFormOnSubmit={handleToggleEpisodeWatched}
																	episodeButtonClassName={'tracked-show-season-episode-button eligible-click-element '+((watchedEpisodes.includes(episode._id)) ? 'watched' : 'unwatched')}
																	episodeButtonId={`tracked-show-season-episode-button-${episode._id}`}
																	episodeButtonType={'submit'}
																	episodeButtonValue={JSON.stringify(episode)}
																	infoButtonDummyClassName={'tracked-show-episode-details-dummy-button'}
																	episodeButtonInnerDivClassName={'tracked-show-season-episode-button-episode-number'}
																	episodeNumber={episode.episodeNumber}
																	infoButtonClassName={'tracked-show-episode-details-open-button eligible-click-element'}
																	infoButtonId={`tracked-show-episode-details-button-${episode._id}`}
																	infoButtonValue={episode._id}
																	infoButtonType={'submit'}
																	infoButtonOnClick={handleEpisodeDetailsButtonClick}
																	infoButtonFontPathClassName={'tracker-details-open-button-icon-font'}
																	infoButtonFontColor={'var(--svg-font-color-info-button-details)'}
																	infoButtonSvgClassName={'tracked-show-episode-details-open-button-svg'}
																	infoButtonPathClassName={'tracked-show-episode-details-open-button-path '+((watchedEpisodes.includes(episode._id)) ? 'watched' : 'unwatched')}
																	infoButtonPathFillColor={'#A7A7A7'}
																/>
															</Tippy>
														</Fragment>
													)
												})}
											</div>
										</div>
									</Fragment>
								)
							})}
						</div>
					:
						(!showTrackedShowSpinner && <div className='no-show-selected-text-container'>
							<div className='no-show-selected-text'>
								Click on a show from your list of tracked shows to start tracking it.
							</div>
						</div>)
					}
				</div>
			</div>
		</>
	);
};
