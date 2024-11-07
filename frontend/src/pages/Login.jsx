import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-hot-toast';

import useGetUserWelcomeRedirect from '../customHooks/dataFetchers/useGetUserWelcomeRedirect.jsx';
import useGetInitialDarkModePreference from '../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx';
import useHandleUserChange from '../customHooks/stateChanges/useHandleUserChange.jsx';
import useHandleLoginSubmit from '../customHooks/formSubmissionHandlers/useHandleLoginSubmit.jsx';

import '../css/Login.css';

import Toast from '../components/Toast.jsx';
import Footer from '../components/Footer.jsx';

export default function Login(){
	const navigate = useNavigate();
	const [user, setUser] = useState({email: '', password:''});
	const {email, password} = user;
	const handleUserChange=(name)=>(e)=>{useHandleUserChange(name, e, user, setUser)};
	const handleLoginSubmit=(e)=>{useHandleLoginSubmit(e, email, password, setUser, navigate)};
	useEffect(()=>{
		useGetUserWelcomeRedirect(navigate);
	}, []);
	useEffect(()=>{
		useGetInitialDarkModePreference();
	},[]);
	return(
		<>
			<div id='login-page'>
				<div className="login-header">
					<h1 className="login-header-text">
						&#x1F914; Did I Watch That?!?! &#x1F9D0;
					</h1>
				</div>
				<form id='login-form' onSubmit={handleLoginSubmit}>
					<input
						type='email'
						placeholder='Email'
						value={email}
						autoFocus={true}
						onChange={handleUserChange('email')}
					/>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={handleUserChange('password')}
					/>
				<button id="login-button" type='submit'>Log In</button>
				</form>
				<div className='register-link-container'>
					<p className='register-link-text'>
						Not registered yet? Register <Link to='/register' className='register-link'>here</Link>.
					</p>
				</div>
			</div>
			<Footer/>
		</>
	);
};
