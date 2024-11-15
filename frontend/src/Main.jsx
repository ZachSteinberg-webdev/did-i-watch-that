import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import './Index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</React.StrictMode>,
);
