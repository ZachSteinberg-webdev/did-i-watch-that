import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useGetUserWelcomeRedirect from '../customHooks/dataFetchers/useGetUserWelcomeRedirect.jsx';
import useGetInitialDarkModePreference from '../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx';
import useHandleUserChange from '../customHooks/stateChanges/useHandleUserChange.jsx';
import useHandleRegistrationSubmit from '../customHooks/formSubmissionHandlers/useHandleRegistrationSubmit.jsx';

import Toast from '../components/Toast.jsx';
import Footer from '../components/Footer.jsx';
import GuestBanner from '../components/GuestBanner.jsx';
import Spinner from '../components/Spinner.jsx';

import '../css/Register.css';

export default function Register() {
	const navigate = useNavigate();
	const [user, setUser] = useState({ name: '', email: '', password: '' });
	const { name, email, password } = user;
	const handleUserChange = (name) => (e) => {
		useHandleUserChange(name, e, user, setUser);
	};
	const [showMigrationSpinner, setShowMigrationSpinner] = useState(false);
	const [migrationMessageVisible, setMigrationMessageVisible] = useState(false);
	const [formStatus, setFormStatus] = useState('visible');

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

	const handleRegistrationSubmit = (e) => {
		resetMigrationUI();
		useHandleRegistrationSubmit(e, name, email, password, setUser, navigate, beginMigrationUI, resetMigrationUI);
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
			<div id='registration-page'>
				<div className='registration-header'>
					<h1 className='registration-header-text'>&#x1F914; Did I Watch That?!?! &#x1F9D0;</h1>
				</div>
				{showMigrationSpinner && (
					<div className='registration-migration-spinner'>
						<Spinner spinnerClassName={'tracked-show-spinner'} />
						{migrationMessageVisible && (
							<p className='registration-migration-message'>
								Just a minute - Migrating your guest data to your account.
								<br />
								This can take several minutes.
							</p>
						)}
					</div>
				)}

				<div className={`registration-form-container ${formStatus === 'hidden' ? 'hidden' : ''}`}>
					<form
						id='registration-form'
						className={formStatus === 'fading' ? 'registration-form-fade' : ''}
						onSubmit={handleRegistrationSubmit}
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
							type='text'
							placeholder='Name'
							value={name}
							autoFocus={true}
							onChange={handleUserChange('name')}
							disabled={isFormDisabled}
						/>

						<input
							type='text'
							placeholder='Email'
							value={email}
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
							id='registration-button'
							type='submit'
							disabled={isFormDisabled}
						>
							Register
						</button>
					</form>
					<div className='login-link-container'>
						<p className='login-link-text'>
							Already registered? Login{' '}
							<Link
								to='/login'
								className='login-link'
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
