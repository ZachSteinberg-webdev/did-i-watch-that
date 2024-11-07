import React, {Fragment} from 'react';

import InfoButtonDummy from './InfoButtonDummy.jsx';
import InfoButton from './InfoButton.jsx';

export default function TrackerSectionHeader({
	sectionHeaderId,
	infoButtonDummyClassName,
	sectionHeaderParagraphId,
	sectionHeaderParagraphText,
	infoButtonId,
	infoButtonOnClick,
	infoButtonFontPathClassName,
	infoButtonFontColor,
	infoButtonSvgId,
	infoButtonPathClassName,
	infoButtonPathFillColor
}){
	return(
		<div id={sectionHeaderId}>
			<InfoButtonDummy
				infoButtonDummyClassName={infoButtonDummyClassName}
			/>
			<p id={sectionHeaderParagraphId}>
				{sectionHeaderParagraphText.map((sectionHeaderParagraphWord, index)=>{
					return(
						<Fragment key={index}>
							<span className={`sectionHeaderWord${index}`}>
								{sectionHeaderParagraphWord}
							</span>
							{((index+1)<sectionHeaderParagraphText.length)&&
								<span className={`sectionHeaderWord${index}`}>
									&nbsp;
								</span>
							}
						</Fragment>
					)
				})}
			</p>
			<InfoButton
				infoButtonId={infoButtonId}
				infoButtonOnClick={infoButtonOnClick}
				infoButtonSvgId={infoButtonSvgId}
				infoButtonFontPathClassName={infoButtonFontPathClassName}
				infoButtonFontColor={infoButtonFontColor}
				infoButtonPathClassName={infoButtonPathClassName}
				infoButtonPathFillColor={infoButtonPathFillColor}
			/>
		</div>
	);
};
