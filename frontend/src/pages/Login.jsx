import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useGetUserWelcomeRedirect from '../customHooks/dataFetchers/useGetUserWelcomeRedirect.jsx';
import useGetInitialDarkModePreference from '../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx';
import useHandleUserChange from '../customHooks/stateChanges/useHandleUserChange.jsx';
import useHandleLoginSubmit from '../customHooks/formSubmissionHandlers/useHandleLoginSubmit.jsx';

import '../css/Login.css';

import Toast from '../components/Toast.jsx';
import Footer from '../components/Footer.jsx';
import GuestBanner from '../components/GuestBanner.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Login() {
	const navigate = useNavigate();
	const [user, setUser] = useState({ email: '', password: '' });
	const { email, password } = user;
	const handleUserChange = (name) => (e) => {
		useHandleUserChange(name, e, user, setUser);
	};
	const [showMigrationSpinner, setShowMigrationSpinner] = useState(false);
	const [migrationMessageVisible, setMigrationMessageVisible] = useState(false);
	const [formStatus, setFormStatus] = useState('visible'); // visible | fading | hidden

	const resetMigrationUI = () => {
		setShowMigrationSpinner(false);
		setMigrationMessageVisible(false);
		setFormStatus('visible');
	};

	const beginMigrationUI = () => {
		if (formStatus === 'visible') {
			setFormStatus('fading');
			setTimeout(() => {
				setFormStatus('hidden');
				setShowMigrationSpinner(true);
				setMigrationMessageVisible(true);
			}, 250);
		} else if (formStatus === 'fading') {
			setTimeout(() => {
				setFormStatus('hidden');
				setShowMigrationSpinner(true);
				setMigrationMessageVisible(true);
			}, 250);
		} else {
			setShowMigrationSpinner(true);
			setMigrationMessageVisible(true);
		}
	};

	const isFormDisabled = formStatus !== 'visible';

	const handleLoginSubmit = (e) => {
		resetMigrationUI();
		useHandleLoginSubmit(e, email, password, setUser, navigate, beginMigrationUI, resetMigrationUI);
	};
	useEffect(() => {
		useGetUserWelcomeRedirect(navigate);
	}, []);
	useEffect(() => {
		useGetInitialDarkModePreference();
	}, []);
	return (
		<>
			<GuestBanner />
			<div id='login-page'>
				<div className='login-header'>
					<h1 className='login-header-text'>&#x1F914; Did I Watch That?!?! &#x1F9D0;</h1>
				</div>
				{showMigrationSpinner && (
					<div className='login-migration-spinner'>
						<Spinner spinnerClassName={'tracked-show-spinner'} />
						{migrationMessageVisible && (
							<p className='login-migration-message'>
								Just a minute - Migrating your guest data to your account.
								<br />
								This can take several minutes.
							</p>
						)}
					</div>
				)}

				<div className={`login-form-container ${formStatus === 'hidden' ? 'hidden' : ''}`}>
					<form
						id='login-form'
						className={formStatus === 'fading' ? 'login-form-fade' : ''}
						onSubmit={handleLoginSubmit}
					>
						<button
							id='continue-as-guest-button'
							type='button'
							onClick={() => {
								localStorage.setItem('guestMode', 'true');
								localStorage.removeItem('guestBannerDismissed');
								navigate('/tracker');
							}}
						>
							Continue as Guest
						</button>
						<input
							type='email'
							placeholder='Email'
							value={email}
							autoFocus={true}
							onChange={handleUserChange('email')}
							disabled={isFormDisabled}
						/>
						<input
							type='password'
							placeholder='Password'
							value={password}
							onChange={handleUserChange('password')}
							disabled={isFormDisabled}
						/>
						<button
							id='login-button'
							type='submit'
							disabled={isFormDisabled}
						>
							Log In
						</button>
					</form>
					<div className='register-link-container'>
						<p className='register-link-text'>
							Not registered yet? Register{' '}
							<Link
								to='/register'
								className='register-link'
							>
								here
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
