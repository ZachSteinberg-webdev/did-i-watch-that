import React, {forwardRef} from 'react';

import InfoButtonDummy from './InfoButtonDummy.jsx';
import InfoButton from './InfoButton.jsx';

const EpisodeButtonForm = forwardRef(function EpisodeButtonForm(props, ref){
	const {
		episodeButtonFormClassName,
		episodeButtonFormId,
		episodeButtonFormOnSubmit,
		episodeButtonClassName,
		episodeButtonId,
		episodeButtonType,
		episodeButtonValue,
		infoButtonDummyClassName,
		episodeButtonInnerDivClassName,
		episodeNumber,
		infoButtonClassName,
		infoButtonId,
		infoButtonValue,
		infoButtonType,
		infoButtonOnClick,
		infoButtonFontColor,
		infoButtonFontPathClassName,
		infoButtonSvgClassName,
		infoButtonPathClassName,
		infoButtonPathFillColor
	}=props;
	return(
		<form
			className={episodeButtonFormClassName}
			id={episodeButtonFormId}
			onSubmit={episodeButtonFormOnSubmit}
			ref={ref}
		>
			<button
				className={episodeButtonClassName}
				id={episodeButtonId}
				type={episodeButtonType}
				value={episodeButtonValue}
			>
				<InfoButtonDummy
					infoButtonDummyClassName={'tracked-show-episode-details-dummy-button'}
				/>
				<div className={episodeButtonInnerDivClassName}>
					{episodeNumber ? `Episode ${episodeNumber}` : 'Special'}
				</div>
				<InfoButton
					infoButtonClassName={infoButtonClassName}
					infoButtonId={infoButtonId}
					infoButtonValue={infoButtonValue}
					infoButtonType={infoButtonType}
					infoButtonOnClick={infoButtonOnClick}
					infoButtonFontPathClassName={infoButtonFontPathClassName}
					infoButtonFontColor={infoButtonFontColor}
					infoButtonSvgClassName={infoButtonSvgClassName}
					infoButtonPathClassName={infoButtonPathClassName}
					infoButtonPathFillColor={infoButtonPathFillColor}
				/>
			</button>
		</form>
	)
});

export default EpisodeButtonForm;
