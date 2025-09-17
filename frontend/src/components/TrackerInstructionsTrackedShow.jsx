import React from 'react';

import '../css/TrackerInstructions.css';

export default function TrackerInstructions({ handleTrackedShowInstructionsModalClose, preventPropagation }) {
	return (
		<div
			className='tracker-instructions-backdrop tracked-show-instructions-backdrop'
			inert={'true'}
			onClick={handleTrackedShowInstructionsModalClose}
		>
			<div
				className='tracker-instructions-container'
				onClick={preventPropagation}
			>
				<div className='tracker-instructions'>
					<p className='tracker-tracked-show-instructions-header tracker-instructions-header'>Tracked Show</p>
					<div className='tracker-instructions-text-scrollbox-wrapper'>
						<div className='tracker-instructions-text-scrollbox'>
							<p className='tracker-instructions-text'>
								This is the show you are currently tracking. To mark an episode as "watched", click it. To mark it as
								"unwatched", click it again. To mark an entire season, or the remaining unwatched episodes of a season,
								as "watched", click on the season's button. To mark the season as "unwatched", click it again.
							</p>
							<p className='tracker-instructions-text'>
								The "Tab" key can be used to cycle through all the episodes of a show in the show tracker. The "Shift +
								Tab" key combination can be used to cycle in reverse order. When a season or episode is highlighted, the
								"Enter" key or Space Bar can be used to mark that whole season or individual episode as watched or
								unwatched.
							</p>
							<p className='tracker-show-add-instructions tracker-instructions-text'>
								The "Alt+S" key combination can be used at any time to focus the <span className='italic'>Show</span>{' '}
								Tracker panel. The "Left Arrow" and "Right Arrow" keys can be used to navigate across the three
								different panes. The header menu can be opened using the "Alt+H" key combination.
							</p>
						</div>
					</div>
					<button
						className='tracker-instructions-close-button'
						id='tracked-show-instructions-close-button'
						onClick={handleTrackedShowInstructionsModalClose}
						tabIndex='-1'
					>
						Got it!
					</button>
				</div>
			</div>
		</div>
	);
}
