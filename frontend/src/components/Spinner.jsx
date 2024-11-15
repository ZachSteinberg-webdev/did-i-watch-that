import React from 'react';

import '../css/Spinner.css';

export default function Spinner({
	spinnerClassName
}){
	return(
		<>
			<div className={spinnerClassName}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" xmlnsXlink="http://www.w3.org/1999/xlink">
					<g>
						<g transform="rotate(0 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.9375s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(22.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.875s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(45 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.8125s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(67.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(90 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.6875s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(112.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.625s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(135 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.5625s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(157.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(180 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.4375s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(202.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.375s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(225 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.3125s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(247.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(270 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.1875s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(292.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.125s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(315 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="-0.0625s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g transform="rotate(337.5 50 50)">
							<rect fill="#808080" height="17" width="5" ry="2.38" rx="2.38" y="18.5" x="47.5" stroke="white">
								<animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity">
								</animate>
							</rect>
						</g>
						<g>
						</g>
					</g>
				</svg>
			</div>
		</>
	);
};
