import React, { Fragment, useEffect } from 'react';
import { useImageSize } from 'react-image-size';

import Spinner from './Spinner.jsx';

import '../css/TrackedShowDetails.css';

export default function TrackedShowDetails({
	trackedShowDetails,
	handleTrackedShowDetailsModalClose,
	preventPropagation
}) {
	const tsd = trackedShowDetails;
	const [showImageDimensions, { loading, error }] = useImageSize(tsd.showImageLink);
	// If the image is currently loading:
	if (loading) {
		return (
			<>
				<div
					className='tracked-show-details-backdrop'
					inert={'true'}
					onClick={handleTrackedShowDetailsModalClose}
				>
					<div
						className='tracked-show-details-container-loading'
						onClick={preventPropagation}
					>
						<div className='tracked-show-details-loading'>
							<div className='tracked-show-details-image-header-and-subheader-container-loading'>
								<div className='tracked-show-details-header-and-subheader-wrapper-loading'>
									<div className='tracked-show-details-header-and-subheader-container-loading'>
										<p className='tracked-show-details-header-loading'>{tsd.showName && tsd.showName}</p>
										<p className='tracked-show-details-subheader-loading'>
											Premiered:{' '}
											{(tsd.showPremiereDate && new Date(tsd.showPremiereDate).toLocaleDateString()) || 'unknown'}
										</p>
										{tsd.showStatus && (
											<p className='tracked-show-minor-details-text-loading'>Status: {tsd.showStatus}</p>
										)}
										{tsd.showEndedDate && (
											<p className='tracked-show-minor-details-text-loading'>Ended: {tsd.showEndedDate}</p>
										)}
										{tsd.showAirDays && tsd.showAirDays.length > 0 && (
											<p className='tracked-show-minor-details-text-loading'>
												Airing:{' '}
												{tsd.showAirDays.map((day, index) => {
													return (
														<Fragment key={index}>
															<span>
																{day}s{index + 2 < tsd.showAirDays.length && ','}
																{index + 1 === tsd.showAirDays.length - 1 && ' and '}
															</span>
															{tsd.showAirTime && <span> at {tsd.showAirTime}</span>}
														</Fragment>
													);
												})}
											</p>
										)}
										{tsd.showCountry && (
											<p className='tracked-show-minor-details-text-loading'>Airing in: {tsd.showCountry}</p>
										)}
										{tsd.showNetwork && (
											<p className='tracked-show-minor-details-text-loading'>
												Airing on: <a href={tsd.showNetworkWebsiteLink}>{tsd.showNetwork}</a>
											</p>
										)}
										{tsd.showWebChannelName && (
											<p className='tracked-show-minor-details-text-loading'>
												Shown on: <a href={tsd.showWebChannelWebsiteLink}>{tsd.showWebChannelName}</a>
											</p>
										)}
										{tsd.showAverageRating && (
											<p className='tracked-show-minor-details-text-loading'>Average rating: {tsd.showAverageRating}</p>
										)}
										{tsd.showAverageRuntime && (
											<p className='tracked-show-minor-details-text-loading'>
												Average runtime: {tsd.showAverageRuntime}
											</p>
										)}
										{tsd.showLanguage && (
											<p className='tracked-show-minor-details-text-loading'>Language: {tsd.showLanguage}</p>
										)}
										{tsd.showType && (
											<p className='tracked-show-minor-details-text-loading'>Show type: {tsd.showType}</p>
										)}
										{tsd.showGenres && tsd.showGenres.length > 0 && (
											<p className='tracked-show-minor-details-text-loading'>
												Genres:{' '}
												{tsd.showGenres.map((genre, index) => {
													return (
														<span key={index}>
															{genre}
															{index + 2 < tsd.showGenres.length && ', '}
															{index + 1 === tsd.showGenres.length - 1 && ' and '}
														</span>
													);
												})}
											</p>
										)}
									</div>
								</div>
								<div className='tracked-show-details-image-loading'>
									<Spinner spinnerClassName={'tracked-show-details-spinner'} />
								</div>
							</div>
							{tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-loading'>
									<p
										className='tracked-show-details-text-loading'
										dangerouslySetInnerHTML={{ __html: tsd.showSummaryHtml }}
									></p>
								</div>
							)}
							{!tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-loading'>
									<p className='tracked-show-details-text-loading'>No summary is available for this show.</p>
								</div>
							)}
							<button
								className='tracked-show-details-close-button tracked-show-details-close-button-loading'
								onClick={handleTrackedShowDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// If a show image link exists AND  is taller than it is wide (PORTRAIT orientation), render this:
	} else if (showImageDimensions && showImageDimensions?.height > showImageDimensions?.width) {
		return (
			<>
				<div
					className='tracked-show-details-backdrop'
					inert={'true'}
					onClick={handleTrackedShowDetailsModalClose}
				>
					<div
						className='tracked-show-details-container-portrait'
						onClick={preventPropagation}
					>
						<div className='tracked-show-details-portrait'>
							<div className='tracked-show-details-image-header-and-subheader-container-portrait'>
								<div className='tracked-show-details-header-and-subheader-wrapper-portrait'>
									<div className='tracked-show-details-header-and-subheader-container-portrait'>
										<p className='tracked-show-details-header-portrait'>{tsd.showName && tsd.showName}</p>
										<p className='tracked-show-details-subheader-portrait'>
											Premiered:{' '}
											{(tsd.showPremiereDate && new Date(tsd.showPremiereDate).toLocaleDateString()) || 'unknown'}
										</p>
										{tsd.showStatus && (
											<p className='tracked-show-minor-details-text-portrait'>Status: {tsd.showStatus}</p>
										)}
										{tsd.showEndedDate && (
											<p className='tracked-show-minor-details-text-portrait'>Ended: {tsd.showEndedDate}</p>
										)}
										{tsd.showAirDays && tsd.showAirDays.length > 0 && (
											<p className='tracked-show-minor-details-text-portrait'>
												Airing:{' '}
												{tsd.showAirDays.map((day, index) => {
													return (
														<Fragment key={index}>
															<span>
																{day}s{index + 2 < tsd.showAirDays.length && ','}
																{index + 1 === tsd.showAirDays.length - 1 && ' and '}
															</span>
															{tsd.showAirTime && <span> at {tsd.showAirTime}</span>}
														</Fragment>
													);
												})}
											</p>
										)}
										{tsd.showCountry && (
											<p className='tracked-show-minor-details-text-portrait'>Airing in: {tsd.showCountry}</p>
										)}
										{tsd.showNetwork && (
											<p className='tracked-show-minor-details-text-portrait'>
												Airing on: <a href={tsd.showNetworkWebsiteLink}>{tsd.showNetwork}</a>
											</p>
										)}
										{tsd.showWebChannelName && (
											<p className='tracked-show-minor-details-text-portrait'>
												Shown on: <a href={tsd.showWebChannelWebsiteLink}>{tsd.showWebChannelName}</a>
											</p>
										)}
										{tsd.showAverageRating && (
											<p className='tracked-show-minor-details-text-portrait'>
												Average rating: {tsd.showAverageRating}
											</p>
										)}
										{tsd.showAverageRuntime && (
											<p className='tracked-show-minor-details-text-portrait'>
												Average runtime: {tsd.showAverageRuntime}
											</p>
										)}
										{tsd.showLanguage && (
											<p className='tracked-show-minor-details-text-portrait'>Language: {tsd.showLanguage}</p>
										)}
										{tsd.showType && (
											<p className='tracked-show-minor-details-text-portrait'>Show type: {tsd.showType}</p>
										)}
										{tsd.showGenres && tsd.showGenres.length > 0 && (
											<p className='tracked-show-minor-details-text-portrait'>
												Genres:{' '}
												{tsd.showGenres.map((genre, index) => {
													return (
														<span key={index}>
															{genre}
															{index + 2 < tsd.showGenres.length && ', '}
															{index + 1 === tsd.showGenres.length - 1 && ' and '}
														</span>
													);
												})}
											</p>
										)}
									</div>
								</div>
								<img
									className='tracked-show-details-image-portrait'
									src={tsd.showImageLink && tsd.showImageLink}
								/>
							</div>
							{tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-portrait'>
									<p
										className='tracked-show-details-text-portrait'
										dangerouslySetInnerHTML={{ __html: tsd.showSummaryHtml }}
									></p>
								</div>
							)}
							{!tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-portrait'>
									<p className='tracked-show-details-text-portrait'>No summary is available for this show.</p>
								</div>
							)}
							<button
								className='tracked-show-details-close-button tracked-show-details-close-button-portrait'
								onClick={handleTrackedShowDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if a show image link exists AND is wider than it is tall (LANDSCAPE orientation), render this:
	} else if (showImageDimensions && showImageDimensions?.height < showImageDimensions?.width) {
		return (
			<>
				<div
					className='tracked-show-details-backdrop'
					inert={'true'}
					onClick={handleTrackedShowDetailsModalClose}
				>
					<div
						className='tracked-show-details-container-landscape'
						onClick={preventPropagation}
					>
						<div className='tracked-show-details-landscape'>
							<img
								className='tracked-show-details-image-landscape'
								src={tsd.showImageLink && tsd.showImageLink}
							/>
							<div className='tracked-show-details-image-header-and-subheader-container-landscape'>
								<div className='tracked-show-details-header-and-subheader-wrapper-landscape'>
									<div className='tracked-show-details-header-and-subheader-container-landscape'>
										<p className='tracked-show-details-header-landscape'>{tsd.showName && tsd.showName}</p>
										<p className='tracked-show-details-subheader-landscape'>
											Premiered:{' '}
											{(tsd.showPremiereDate && new Date(tsd.showPremiereDate).toLocaleDateString()) || 'unknown'}
										</p>
										{tsd.showStatus && (
											<p className='tracked-show-minor-details-text-landscape'>Status: {tsd.showStatus}</p>
										)}
										{tsd.showEndedDate && (
											<p className='tracked-show-minor-details-text-landscape'>Ended: {tsd.showEndedDate}</p>
										)}
										{tsd.showAirDays && tsd.showAirDays.length > 0 && (
											<p className='tracked-show-minor-details-text-landscape'>
												Airing:{' '}
												{tsd.showAirDays.map((day, index) => {
													return (
														<Fragment key={index}>
															<span>
																{day}s{index + 2 < tsd.showAirDays.length && ','}
																{index + 1 === tsd.showAirDays.length - 1 && ' and '}
															</span>
															{tsd.showAirTime && <span> at {tsd.showAirTime}</span>}
														</Fragment>
													);
												})}
											</p>
										)}
										{tsd.showCountry && (
											<p className='tracked-show-minor-details-text-landscape'>Airing in: {tsd.showCountry}</p>
										)}
										{tsd.showNetwork && (
											<p className='tracked-show-minor-details-text-landscape'>
												Airing on: <a href={tsd.showNetworkWebsiteLink}>{tsd.showNetwork}</a>
											</p>
										)}
										{tsd.showWebChannelName && (
											<p className='tracked-show-minor-details-text-landscape'>
												Shown on: <a href={tsd.showWebChannelWebsiteLink}>{tsd.showWebChannelName}</a>
											</p>
										)}
										{tsd.showAverageRating && (
											<p className='tracked-show-minor-details-text-landscape'>
												Average rating: {tsd.showAverageRating}
											</p>
										)}
										{tsd.showAverageRuntime && (
											<p className='tracked-show-minor-details-text-landscape'>
												Average runtime: {tsd.showAverageRuntime}
											</p>
										)}
										{tsd.showLanguage && (
											<p className='tracked-show-minor-details-text-landscape'>Language: {tsd.showLanguage}</p>
										)}
										{tsd.showType && (
											<p className='tracked-show-minor-details-text-landscape'>Show type: {tsd.showType}</p>
										)}
										{tsd.showGenres && tsd.showGenres.length > 0 && (
											<p className='tracked-show-minor-details-text-landscape'>
												Genres:{' '}
												{tsd.showGenres.map((genre, index) => {
													return (
														<span key={index}>
															{genre}
															{index + 2 < tsd.showGenres.length && ', '}
															{index + 1 === tsd.showGenres.length - 1 && ' and '}
														</span>
													);
												})}
											</p>
										)}
									</div>
								</div>
								{tsd.showSummaryHtml && (
									<div className='tracked-show-details-text-wrapper-landscape'>
										<p
											className='tracked-show-details-text-landscape'
											dangerouslySetInnerHTML={{ __html: tsd.showSummaryHtml }}
										></p>
									</div>
								)}
								{!tsd.showSummaryHtml && (
									<div className='tracked-show-details-text-wrapper-landscape'>
										<p className='tracked-show-details-text-landscape'>No summary is available for this show.</p>
									</div>
								)}
							</div>
							<button
								className='tracked-show-details-close-button tracked-show-details-close-button-landscape'
								onClick={handleTrackedShowDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if a show image link exists AND has equal width and height (SQUARE orientation), render this:
	} else if (showImageDimensions && showImageDimensions?.height === showImageDimensions?.width) {
		return (
			<>
				<div
					className='tracked-show-details-backdrop'
					inert={'true'}
					onClick={handleTrackedShowDetailsModalClose}
				>
					<div
						className='tracked-show-details-container-square'
						onClick={preventPropagation}
					>
						<div className='tracked-show-details-square'>
							<div className='tracked-show-details-image-header-and-subheader-container-square'>
								<div className='tracked-show-details-header-and-subheader-wrapper-square'>
									<div className='tracked-show-details-header-and-subheader-container-square'>
										<p className='tracked-show-details-header-square'>{tsd.showName && tsd.showName}</p>
										<p className='tracked-show-details-subheader-square'>
											Premiered:{' '}
											{(tsd.showPremiereDate && new Date(tsd.showPremiereDate).toLocaleDateString()) || 'unknown'}
										</p>
										{tsd.showStatus && (
											<p className='tracked-show-minor-details-text-square'>Status: {tsd.showStatus}</p>
										)}
										{tsd.showEndedDate && (
											<p className='tracked-show-minor-details-text-square'>Ended: {tsd.showEndedDate}</p>
										)}
										{tsd.showAirDays && tsd.showAirDays.length > 0 && (
											<p className='tracked-show-minor-details-text-square'>
												Airing:{' '}
												{tsd.showAirDays.map((day, index) => {
													return (
														<Fragment key={index}>
															<span>
																{day}s{index + 2 < tsd.showAirDays.length && ','}
																{index + 1 === tsd.showAirDays.length - 1 && ' and '}
															</span>
															{tsd.showAirTime && <span> at {tsd.showAirTime}</span>}
														</Fragment>
													);
												})}
											</p>
										)}
										{tsd.showCountry && (
											<p className='tracked-show-minor-details-text-square'>Airing in: {tsd.showCountry}</p>
										)}
										{tsd.showNetwork && (
											<p className='tracked-show-minor-details-text-square'>
												Airing on: <a href={tsd.showNetworkWebsiteLink}>{tsd.showNetwork}</a>
											</p>
										)}
										{tsd.showWebChannelName && (
											<p className='tracked-show-minor-details-text-square'>
												Shown on: <a href={tsd.showWebChannelWebsiteLink}>{tsd.showWebChannelName}</a>
											</p>
										)}
										{tsd.showAverageRating && (
											<p className='tracked-show-minor-details-text-square'>Average rating: {tsd.showAverageRating}</p>
										)}
										{tsd.showAverageRuntime && (
											<p className='tracked-show-minor-details-text-square'>
												Average runtime: {tsd.showAverageRuntime}
											</p>
										)}
										{tsd.showLanguage && (
											<p className='tracked-show-minor-details-text-square'>Language: {tsd.showLanguage}</p>
										)}
										{tsd.showType && (
											<p className='tracked-show-minor-details-text-square'>Show type: {tsd.showType}</p>
										)}
										{tsd.showGenres && tsd.showGenres.length > 0 && (
											<p className='tracked-show-minor-details-text-square'>
												Genres:{' '}
												{tsd.showGenres.map((genre, index) => {
													return (
														<span key={index}>
															{genre}
															{index + 2 < tsd.showGenres.length && ', '}
															{index + 1 === tsd.showGenres.length - 1 && ' and '}
														</span>
													);
												})}
											</p>
										)}
									</div>
								</div>
								<img
									className='tracked-show-details-image-square'
									src={tsd.showImageLink && tsd.showImageLink}
								/>
							</div>
							{tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-square'>
									<p
										className='tracked-show-details-text-square'
										dangerouslySetInnerHTML={{ __html: tsd.showSummaryHtml }}
									></p>
								</div>
							)}
							{!tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-square'>
									<p className='tracked-show-details-text-square'>No summary is available for this show.</p>
								</div>
							)}
							<button
								className='tracked-show-details-close-button tracked-show-details-close-button-square'
								onClick={handleTrackedShowDetailsModalClose}
								tabIndex='-1'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</>
		);
		// Else if no episode or show image link exists (NO IMAGE), render this:
	} else {
		return (
			<>
				<div
					className='tracked-show-details-backdrop'
					inert={'true'}
					onClick={handleTrackedShowDetailsModalClose}
				>
					<div
						className='tracked-show-details-container-no-image'
						onClick={preventPropagation}
					>
						<div className='tracked-show-details-no-image'>
							<div className='tracked-show-details-image-header-and-subheader-container-no-image'>
								<div className='tracked-show-details-header-and-subheader-wrapper-no-image'>
									<div className='tracked-show-details-header-and-subheader-container-no-image'>
										<p className='tracked-show-details-header-no-image'>{tsd.showName && tsd.showName}</p>
										<p className='tracked-show-details-subheader-no-image'>
											Premiered:{' '}
											{(tsd.showPremiereDate && new Date(tsd.showPremiereDate).toLocaleDateString()) || 'unknown'}
										</p>
										{tsd.showStatus && (
											<p className='tracked-show-minor-details-text-no-image'>Status: {tsd.showStatus}</p>
										)}
										{tsd.showEndedDate && (
											<p className='tracked-show-minor-details-text-no-image'>Ended: {tsd.showEndedDate}</p>
										)}
										{tsd.showAirDays && tsd.showAirDays.length > 0 && (
											<p className='tracked-show-minor-details-text-no-image'>
												Airing:{' '}
												{tsd.showAirDays.map((day, index) => {
													return (
														<Fragment key={index}>
															<span>
																{day}s{index + 2 < tsd.showAirDays.length && ','}
																{index + 1 === tsd.showAirDays.length - 1 && ' and '}
															</span>
															{tsd.showAirTime && <span> at {tsd.showAirTime}</span>}
														</Fragment>
													);
												})}
											</p>
										)}
										{tsd.showCountry && (
											<p className='tracked-show-minor-details-text-no-image'>Airing in: {tsd.showCountry}</p>
										)}
										{tsd.showNetwork && (
											<p className='tracked-show-minor-details-text-no-image'>
												Airing on: <a href={tsd.showNetworkWebsiteLink}>{tsd.showNetwork}</a>
											</p>
										)}
										{tsd.showWebChannelName && (
											<p className='tracked-show-minor-details-text-no-image'>
												Shown on: <a href={tsd.showWebChannelWebsiteLink}>{tsd.showWebChannelName}</a>
											</p>
										)}
										{tsd.showAverageRating && (
											<p className='tracked-show-minor-details-text-no-image'>
												Average rating: {tsd.showAverageRating}
											</p>
										)}
										{tsd.showAverageRuntime && (
											<p className='tracked-show-minor-details-text-no-image'>
												Average runtime: {tsd.showAverageRuntime}
											</p>
										)}
										{tsd.showLanguage && (
											<p className='tracked-show-minor-details-text-no-image'>Language: {tsd.showLanguage}</p>
										)}
										{tsd.showType && (
											<p className='tracked-show-minor-details-text-no-image'>Show type: {tsd.showType}</p>
										)}
										{tsd.showGenres && tsd.showGenres.length > 0 && (
											<p className='tracked-show-minor-details-text-no-image'>
												Genres:{' '}
												{tsd.showGenres.map((genre, index) => {
													return (
														<span key={index}>
															{genre}
															{index + 2 < tsd.showGenres.length && ', '}
															{index + 1 === tsd.showGenres.length - 1 && ' and '}
														</span>
													);
												})}
											</p>
										)}
									</div>
								</div>
								<div className='tracked-show-details-image-no-image'>No image is available for this show.</div>
							</div>
							{tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-no-image'>
									<p
										className='tracked-show-details-text-no-image'
										dangerouslySetInnerHTML={{ __html: tsd.showSummaryHtml }}
									></p>
								</div>
							)}
							{!tsd.showSummaryHtml && (
								<div className='tracked-show-details-text-wrapper-no-image'>
									<p className='tracked-show-details-text-no-image'>No summary is available for this show.</p>
								</div>
							)}
							<button
								className='tracked-show-details-close-button tracked-show-details-close-button-no-image'
								onClick={handleTrackedShowDetailsModalClose}
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
