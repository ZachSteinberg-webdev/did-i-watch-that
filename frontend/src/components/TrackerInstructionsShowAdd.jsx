import React from 'react';

import '../css/TrackerInstructions.css';

export default function TrackerInstructions({ handleShowAddInstructionsModalClose, preventPropagation }) {
	return (
		<div
			className='tracker-instructions-backdrop show-add-instructions-backdrop'
			inert={'true'}
			onClick={handleShowAddInstructionsModalClose}
		>
			<div
				className='tracker-instructions-container'
				onClick={preventPropagation}
			>
				<div className='tracker-instructions'>
					<p className='tracker-show-add-instructions-header tracker-instructions-header'>Add a Show</p>
					<div className='tracker-instructions-text-scrollbox-wrapper'>
						<div className='tracker-instructions-text-scrollbox'>
							<p className='tracker-show-add-instructions tracker-instructions-text'>
								Enter the full or partial name of a show you want to track. Then, press the "Enter" key. A list of up to
								ten shows matching your search term will display in the box below the search field. If you don't see the
								show you're looking for, try a more precise search term.
							</p>
							<p className='tracker-show-add-instructions tracker-instructions-text'>
								The "Tab" key can be used to cycle through the list of suggested shows. The "Shift + Tab" key
								combination can be used to cycle in reverse order. When your desired show is highlighted, the "Enter"
								key or Space Bar can be used to add that show to your list of tracked shows.
							</p>
							<p className='tracker-show-add-instructions tracker-instructions-text'>
								The "Alt+I" key combination can be used at any time to focus the search{' '}
								<span className='italic'>input</span> bar. The "Alt+A" key combiation can be used at any time to focus
								the <span className='italic'>Add</span> a Show suggestion box. The "Left Arrow" and "Right Arrow" keys
								can be used to navigate across the three different panes. The header menu can be opened using the
								"Alt+H" key combination.
							</p>
						</div>
					</div>
					<button
						className='tracker-instructions-close-button'
						id='show-add-instructions-close-button'
						onClick={handleShowAddInstructionsModalClose}
						tabIndex='-1'
					>
						Got it!
					</button>
				</div>
			</div>
		</div>
	);
}
