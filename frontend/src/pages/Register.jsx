import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-hot-toast';

import useGetUserWelcomeRedirect from '../customHooks/dataFetchers/useGetUserWelcomeRedirect.jsx';
import useGetInitialDarkModePreference from '../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx';
import useHandleUserChange from '../customHooks/stateChanges/useHandleUserChange.jsx';
import useHandleRegistrationSubmit from '../customHooks/formSubmissionHandlers/useHandleRegistrationSubmit.jsx';

import Toast from '../components/Toast.jsx';
import Footer from '../components/Footer.jsx';

import '../css/Register.css';

export default function Register(){
	const navigate = useNavigate();
	const [user, setUser] = useState({name: '', email: '', password:''});
	const {name, email, password} = user;
	const handleUserChange=(name)=>(e)=>{useHandleUserChange(name, e, user, setUser)};
	const handleRegistrationSubmit=(e)=>{useHandleRegistrationSubmit(e, name, email, password, setUser, navigate)};
	useEffect(()=>{useGetUserWelcomeRedirect(navigate);}, []);
	useEffect(()=>{useGetInitialDarkModePreference();},[]);
	return(
		<>
			<div id='registration-page'>
				<div className='registration-header'>
					<h1 className='registration-header-text'>
						&#x1F914; Did I Watch That?!?! &#x1F9D0;
					</h1>
				</div>
				<form id='registration-form' onSubmit={handleRegistrationSubmit}>
					<input
						type='text'
						placeholder='Name'
						value={name}
						autoFocus={true}
						onChange={handleUserChange('name')}
					/>
					<input
						type='text'
						placeholder='Email'
						value={email}
						onChange={handleUserChange('email')}
					/>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={handleUserChange('password')}
					/>
					<button id='registration-button' type='submit'>Register</button>
				</form>
				<div className='login-link-container'>
					<p className='login-link-text'>
						Already registered? Login <Link to='/login' className='login-link'>here</Link>.
					</p>
				</div>
			</div>
			<Footer/>
		</>
	);
};
