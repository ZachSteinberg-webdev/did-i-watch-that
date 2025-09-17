import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../css/Toast.css';

export default function GuestBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
		const dismissed = JSON.parse(localStorage.getItem('guestBannerDismissed') || 'false');
		setVisible(guestMode && !dismissed);
	}, []);

	const handleDismiss = () => {
		localStorage.setItem('guestBannerDismissed', 'true');
		setVisible(false);
	};

	if (!visible) {
		return null;
	}

	return (
		<div
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 1000,
				width: '100%',
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			<div
				style={{
					maxWidth: '1100px',
					margin: '0.5rem',
					padding: '0.75rem 1rem',
					border: 'var(--border-global)',
					borderRadius: 'var(--border-radius-global)',
					backgroundColor: 'var(--toast-background-color)'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
					<span
						role='img'
						aria-label='info'
					>
						ℹ️
					</span>
					<div style={{ flex: 1, color: 'var(--font-color)' }}>
						You’re using guest mode.{' '}
						<Link
							to='/register'
							style={{
								color: 'var(--link-color)',
								textDecoration: 'underline'
							}}
						>
							Create an account
						</Link>{' '}
						to permanently save your tracked shows and progress.
					</div>
					<button
						onClick={handleDismiss}
						style={{ width: 'auto', margin: '0' }}
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	);
}
