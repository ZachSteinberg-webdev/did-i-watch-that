import axios from 'axios';
import {toast} from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useHandleRegistrationSubmit=async(
	e,
	name,
	email,
	password,
	setUser,
	navigate
)=>{
	e.preventDefault();
	try{
		const {data} = await axios.post('/api/register', {
			name,
			email,
			password
		});
		if  (data.success === true){
			setUser({name: '', email: '', password:''});
			const messageHeader = 'Registration successful! Welcome aboard!';
			const messageArray = ['You are now registered and logged in.'];
			toast.success(<Toast icon='👍' messageHeader={messageHeader} messageArray={messageArray}/>, {icon: false});
			if(typeof window !== 'undefined'){
				localStorage.setItem('token', JSON.stringify(data));
				localStorage.setItem('userPrefersDarkMode', true);
			};
			navigate('/tracker');
		};
	}catch(err){
		console.log('Error in frontend Register.jsx', err);
		let messageArray = err.response.data.error;
		toast.error(<Toast icon='👎' messageHeader='Registration failed:' messageArray={messageArray}/>, {icon: false});
	};
};

export default useHandleRegistrationSubmit;
