import axios from 'axios';
import {toast} from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useHandleLoginSubmit=async(
	e,
	email,
	password,
	setUser,
	navigate
)=>{
	e.preventDefault();
	try{
		const {data} = await axios.post('/api/login', {
			email,
			password
		});
		if  (data.success === true){
			setUser({email: '', password:''});
			toast.success(<Toast icon='👍' messageParagraph='Login successful! Come on in!'/>, {icon: false});
			if(typeof window !== 'undefined'){
				localStorage.setItem('token', JSON.stringify(data));
				localStorage.setItem('userPrefersDarkMode', data.user.prefersDarkMode);
			};
			navigate('/tracker');
		};
	}catch(err){
		console.log('Error in frontend Login.jsx', err);
		let messageArray = err.response.data.error;
		toast.error(<Toast icon='👎' messageHeader='Login failed:' messageArray={messageArray}/>, {icon: false});
	};
};

export default useHandleLoginSubmit;
