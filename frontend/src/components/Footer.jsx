import React from 'react';
import { Link } from 'react-router-dom';

import '../css/Footer.css';

export default function Footer() {
	return (
		<div className='footer'>
			<p>
				&#x00A9; 2024{' '}
				<Link
					to='https://www.ZachSteinberg.com'
					className='portfolio-link'
					target='_blank'
					rel='noreferrer'
					tabIndex='-1'
				>
					Zach Steinberg
				</Link>
			</p>
		</div>
	);
}
