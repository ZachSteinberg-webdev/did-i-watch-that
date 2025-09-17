import React, { useEffect } from 'react';
import { useImageSize } from 'react-image-size';

import Spinner from './Spinner.jsx';

import '../css/TrackedShowEpisodeDetails.css';

export default function TrackedShowEpisodeDetails({
	hoveredEpisodeDetails,
	handleEpisodeDetailsModalClose,
	updateEpisodeModalCloseButton,
	preventPropagation
}) {
	const hed = hoveredEpisodeDetails;
	const [episodeImageDimensions, { loading, error }] = useImageSize(hed.episodeImageLink);
	useEffect(() => {
		let closeButton = document.querySelector('.tracked-show-episode-details-close-button');
		updateEpisodeModalCloseButton(closeButton);
	});
	// If an image is loading:
	if (loading) {
		return (
			<>
				<div
					className='tracked-show-episode-details-backdrop'
					inert={'true'}
					onClick={handleEpisodeDetailsModalClose}
				>
					<div
						className='tracked-show-episode-details-container-loading'
						onClick={preventPropagation}
					>
						<div className='tracked-show-episode-details-loading'>
							<div className='tracked-show-episode-details-image-header-and-subheader-container-loading'>
								<div className='tracked-show-episode-details-header-and-subheader-wrapper-loading'>
									<div className='tracked-show-episode-details-header-and-subheader-container-loading'>
										<p className='tracked-show-episode-details-header-loading'>{hed.showName && hed.showName}</p>
										<p className='tracked-show-episode-details-subheader-loading'>
											{hed.episodeNumber && `S${hed.seasonNumber.toString().padStart(2, '0')}`}
											{hed.episodeNumber && `E${hed.episodeNumber.toString().padStart(2, '0')}`}
											{!hed.episodeNumber && `Season ${hed.seasonNumber} Special`}:{' '}
											{hed.episodeTitle && hed.episodeTitle}
										</p>
										{hed.episodeAirstamp && (
											<p className='tracked-show-episode-minor-details-text-loading'>
												{`First aired: ${new Date(hed.episodeAirstamp).toLocaleDateString()} at ${new Date(hed.episodeAirstamp).toLocaleTimeString()}`}
											</p>
										)}
										{hed.episodeRuntime && (
											<p className='tracked-show-episode-minor-details-text-loading'>
												{`Runtime: ${hed.episodeRuntime} minutes`}
											</p>
										)}
										{hed.episodeRating && (
											<p className='tracked-show-episode-minor-details-text-loading'>
												{`Rating: ${hed.episodeRating}/10`}
											</p>
										)}
									</div>
								</div>
								<div className='tracked-show-episode-details-image-loading'>
									<Spinner spinnerClassName={'tracked-show-episode-details-spinner'} />
								</div>
							</div>
							{hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-loading'>
									<p
										className='tracked-show-episode-details-text-loading'
										dangerouslySetInnerHTML={{ __html: hed.episodeSummaryHtml }}
									></p>
								</div>
							)}
							{!hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-loading'>
									<p className='tracked-show-episode-details-text-loading'>No summary is available for this episode.</p>
								</div>
							)}
							<button
								className='tracked-show-episode-details-close-button tracked-show-episode-details-close-button-loading'
								onClick={handleEpisodeDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// If an episode or show image link exists AND either one is taller than it is wide (PORTRAIT orientation), render this:
	} else if (episodeImageDimensions && episodeImageDimensions.height > episodeImageDimensions.width) {
		return (
			<>
				<div
					className='tracked-show-episode-details-backdrop'
					inert={'true'}
					onClick={handleEpisodeDetailsModalClose}
				>
					<div
						className='tracked-show-episode-details-container-portrait'
						onClick={preventPropagation}
					>
						<div className='tracked-show-episode-details-portrait'>
							<div className='tracked-show-episode-details-image-header-and-subheader-container-portrait'>
								<div className='tracked-show-episode-details-header-and-subheader-wrapper-portrait'>
									<div className='tracked-show-episode-details-header-and-subheader-container-portrait'>
										<p className='tracked-show-episode-details-header-portrait'>{hed.showName && hed.showName}</p>
										<p className='tracked-show-episode-details-subheader-portrait'>
											{hed.episodeNumber && `S${hed.seasonNumber.toString().padStart(2, '0')}`}
											{hed.episodeNumber && `E${hed.episodeNumber.toString().padStart(2, '0')}`}
											{!hed.episodeNumber && `Season ${hed.seasonNumber} Special`}:{' '}
											{hed.episodeTitle && hed.episodeTitle}
										</p>
										{hed.episodeAirstamp && (
											<p className='tracked-show-episode-minor-details-text-portrait'>
												{`First aired: ${new Date(hed.episodeAirstamp).toLocaleDateString()} at ${new Date(hed.episodeAirstamp).toLocaleTimeString()}`}
											</p>
										)}
										{hed.episodeRuntime && (
											<p className='tracked-show-episode-minor-details-text-portrait'>
												{`Runtime: ${hed.episodeRuntime} minutes`}
											</p>
										)}
										{hed.episodeRating && (
											<p className='tracked-show-episode-minor-details-text-portrait'>
												{`Rating: ${hed.episodeRating}/10`}
											</p>
										)}
									</div>
								</div>
								<img
									className='tracked-show-episode-details-image-portrait'
									src={(hed.episodeImageLink || hed.showImageLink) && (hed.episodeImageLink || hed.showImageLink)}
								/>
							</div>
							{hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-portrait'>
									<p
										className='tracked-show-episode-details-text-portrait'
										dangerouslySetInnerHTML={{ __html: hed.episodeSummaryHtml }}
									></p>
								</div>
							)}
							{!hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-portrait'>
									<p className='tracked-show-episode-details-text-portrait'>
										No summary is available for this episode.
									</p>
								</div>
							)}
							<button
								className='tracked-show-episode-details-close-button tracked-show-episode-details-close-button-portrait'
								onClick={handleEpisodeDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if an episode or show image link exists AND either one is wider than it is tall (LANDSCAPE orientation), render this:
	} else if (episodeImageDimensions && episodeImageDimensions.height < episodeImageDimensions.width) {
		return (
			<>
				<div
					className='tracked-show-episode-details-backdrop'
					inert={'true'}
					onClick={handleEpisodeDetailsModalClose}
				>
					<div
						className='tracked-show-episode-details-container-landscape'
						onClick={preventPropagation}
					>
						<div className='tracked-show-episode-details-landscape'>
							<img
								className='tracked-show-episode-details-image-landscape'
								src={(hed.episodeImageLink || hed.showImageLink) && (hed.episodeImageLink || hed.showImageLink)}
							/>
							<div className='tracked-show-episode-details-image-header-and-subheader-container-landscape'>
								<div className='tracked-show-episode-details-header-and-subheader-wrapper-landscape'>
									<div className='tracked-show-episode-details-header-and-subheader-container-landscape'>
										<p className='tracked-show-episode-details-header-landscape'>{hed.showName && hed.showName}</p>
										<p className='tracked-show-episode-details-subheader-landscape'>
											{hed.episodeNumber && `S${hed.seasonNumber.toString().padStart(2, '0')}`}
											{hed.episodeNumber && `E${hed.episodeNumber.toString().padStart(2, '0')}`}
											{!hed.episodeNumber && `Season ${hed.seasonNumber} Special`}:{' '}
											{hed.episodeTitle && hed.episodeTitle}
										</p>
										{hed.episodeAirstamp && (
											<p className='tracked-show-episode-minor-details-text-landscape'>
												{`First aired: ${new Date(hed.episodeAirstamp).toLocaleDateString()} at ${new Date(hed.episodeAirstamp).toLocaleTimeString()}`}
											</p>
										)}
										{hed.episodeRuntime && (
											<p className='tracked-show-episode-minor-details-text-landscape'>
												{`Runtime: ${hed.episodeRuntime} minutes`}
											</p>
										)}
										{hed.episodeRating && (
											<p className='tracked-show-episode-minor-details-text-landscape'>
												{`Rating: ${hed.episodeRating}/10`}
											</p>
										)}
									</div>
								</div>
								{hed.episodeSummaryHtml && (
									<div className='tracked-show-episode-details-text-wrapper-landscape'>
										<p
											className='tracked-show-episode-details-text-landscape'
											dangerouslySetInnerHTML={{
												__html: hed.episodeSummaryHtml
											}}
										></p>
									</div>
								)}
								{!hed.episodeSummaryHtml && (
									<div className='tracked-show-episode-details-text-wrapper-landscape'>
										<p className='tracked-show-episode-details-text-landscape'>
											No summary is available for this episode.
										</p>
									</div>
								)}
							</div>
							<button
								className='tracked-show-episode-details-close-button tracked-show-episode-details-close-button-landscape'
								onClick={handleEpisodeDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if an episode or show image link exists AND either one has equal width and height (SQUARE orientation), render this:
	} else if (episodeImageDimensions && episodeImageDimensions.height === episodeImageDimensions.width) {
		return (
			<>
				<div
					className='tracked-show-episode-details-backdrop'
					inert={'true'}
					onClick={handleEpisodeDetailsModalClose}
				>
					<div
						className='tracked-show-episode-details-container-square'
						onClick={preventPropagation}
					>
						<div className='tracked-show-episode-details-square'>
							<div className='tracked-show-episode-details-image-header-and-subheader-container-square'>
								<div className='tracked-show-episode-details-header-and-subheader-wrapper-square'>
									<div className='tracked-show-episode-details-header-and-subheader-container-square'>
										<p className='tracked-show-episode-details-header-square'>{hed.showName && hed.showName}</p>
										<p className='tracked-show-episode-details-subheader-square'>
											{hed.episodeNumber && `S${hed.seasonNumber.toString().padStart(2, '0')}`}
											{hed.episodeNumber && `E${hed.episodeNumber.toString().padStart(2, '0')}`}
											{!hed.episodeNumber && `Season ${hed.seasonNumber} Special`}:{' '}
											{hed.episodeTitle && hed.episodeTitle}
										</p>
										{hed.episodeAirstamp && (
											<p className='tracked-show-episode-minor-details-text-square'>
												{`First aired: ${new Date(hed.episodeAirstamp).toLocaleDateString()} at ${new Date(hed.episodeAirstamp).toLocaleTimeString()}`}
											</p>
										)}
										{hed.episodeRuntime && (
											<p className='tracked-show-episode-minor-details-text-square'>
												{`Runtime: ${hed.episodeRuntime} minutes`}
											</p>
										)}
										{hed.episodeRating && (
											<p className='tracked-show-episode-minor-details-text-square'>
												{`Rating: ${hed.episodeRating}/10`}
											</p>
										)}
									</div>
								</div>
								<img
									className='tracked-show-episode-details-image-square'
									src={(hed.episodeImageLink || hesd.showImageLink) && (hed.episodeImageLink || hesd.showImageLink)}
								/>
							</div>
							{hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-square'>
									<p
										className='tracked-show-episode-details-text-square'
										dangerouslySetInnerHTML={{ __html: hed.episodeSummaryHtml }}
									></p>
								</div>
							)}
							{!hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-square'>
									<p className='tracked-show-episode-details-text-square'>No summary is available for this episode.</p>
								</div>
							)}
							<button
								className='tracked-show-episode-details-close-button tracked-show-episode-details-close-button-square'
								onClick={handleEpisodeDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if no episode or show image link exists, render this:
	} else {
		return (
			<>
				<div
					className='tracked-show-episode-details-backdrop'
					inert={'true'}
					onClick={handleEpisodeDetailsModalClose}
				>
					<div
						className='tracked-show-episode-details-container-no-image'
						onClick={preventPropagation}
					>
						<div className='tracked-show-episode-details-no-image'>
							<div className='tracked-show-episode-details-image-header-and-subheader-container-no-image'>
								<div className='tracked-show-episode-details-header-and-subheader-wrapper-no-image'>
									<div className='tracked-show-episode-details-header-and-subheader-container-no-image'>
										<p className='tracked-show-episode-details-header-no-image'>{hed.showName && hed.showName}</p>
										<p className='tracked-show-episode-details-subheader-no-image'>
											{hed.episodeNumber && `S${hed.seasonNumber.toString().padStart(2, '0')}`}
											{hed.episodeNumber && `E${hed.episodeNumber.toString().padStart(2, '0')}`}
											{!hed.episodeNumber && `Season ${hed.seasonNumber} Special`}:{' '}
											{hed.episodeTitle && hed.episodeTitle}
										</p>
										{hed.episodeAirstamp && (
											<p className='tracked-show-episode-minor-details-text-no-image'>
												{`First aired: ${new Date(hed.episodeAirstamp).toLocaleDateString()} at ${new Date(hed.episodeAirstamp).toLocaleTimeString()}`}
											</p>
										)}
										{hed.episodeRuntime && (
											<p className='tracked-show-episode-minor-details-text-no-image'>
												{`Runtime: ${hed.episodeRuntime} minutes`}
											</p>
										)}
										{hed.episodeRating && (
											<p className='tracked-show-episode-minor-details-text-no-image'>
												{`Rating: ${hed.episodeRating}/10`}
											</p>
										)}
									</div>
								</div>
								<div className='tracked-show-episode-details-image-no-image'>
									No image is available for this episode.
								</div>
							</div>
							{hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-no-image'>
									<p
										className='tracked-show-episode-details-text-no-image'
										dangerouslySetInnerHTML={{ __html: hed.episodeSummaryHtml }}
									></p>
								</div>
							)}
							{!hed.episodeSummaryHtml && (
								<div className='tracked-show-episode-details-text-wrapper-no-image'>
									<p className='tracked-show-episode-details-text-no-image'>
										No summary is available for this episode.
									</p>
								</div>
							)}
							<button
								className='tracked-show-episode-details-close-button tracked-show-episode-details-close-button-no-image'
								onClick={handleEpisodeDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}
}
