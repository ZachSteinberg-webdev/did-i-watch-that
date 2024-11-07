import React from 'react';
import {Route, Navigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Toast from './Toast.jsx';

export default function PrivateRoute({children}){
	const auth = localStorage.getItem('token');
	if(auth){
		return <>{children}</>
	}else{
		setTimeout(()=>{
			toast.error(<Toast icon='⚠️' messageParagraph='You must be logged in to view that page.'/>, {icon: false, id: 'loginRedirect'});
		}, 1);
		return <Navigate to='/login'/>;
	};
};
