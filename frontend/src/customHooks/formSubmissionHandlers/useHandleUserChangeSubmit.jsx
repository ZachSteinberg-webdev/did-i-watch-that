import axios from 'axios';
import { toast } from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useHandleUserChangeSubmit = async (e, name, email, oldPassword, newPassword, setUser) => {
	e.preventDefault();
	try {
		const userDetailData = await axios.post('/api/updateUser', {
			name,
			email
		});
		if (userDetailData.data.success === true) {
			setUser({ name: name, email: email });
			const userDetailsUpdateMessage = 'Success! Your details have been updated.';
			toast.success(
				<Toast
					icon='👍'
					messageParagraph={userDetailsUpdateMessage}
				/>,
				{ icon: false }
			);
		}
	} catch (err) {
		console.log('err from Dashboard.jsx frontend', err);
		if (err.response.data.error) {
			let messageArray = err.response.data.error;
			toast.error(
				<Toast
					icon='👎'
					messageHeader='Update failed:'
					messageArray={messageArray}
				/>,
				{ icon: false }
			);
		} else {
			toast.error(
				<Toast
					icon='👎'
					messageParagraph='Update failed. Please try again later.'
				/>,
				{ icon: false }
			);
		}
	}
	try {
		const userPasswordData = await axios.post('/api/updatePassword', {
			oldPassword,
			newPassword
		});
		if (userPasswordData.data.success === true) {
			const userPasswordUpdateMessage = 'Success! Your password has been updated.';
			toast.success(
				<Toast
					icon='👍'
					messageParagraph={userPasswordUpdateMessage}
				/>,
				{ icon: false }
			);
		}
	} catch (err) {
		console.log('err from Dashboard.jsx frontend', err);
		if (err.response.data.error) {
			let messageArray = err.response.data.error;
			toast.error(
				<Toast
					icon='👎'
					messageHeader='Update failed:'
					messageArray={messageArray}
				/>,
				{ icon: false }
			);
		} else {
			toast.error(
				<Toast
					icon='👎'
					messageParagraph='Update failed. Please try again later.'
				/>,
				{ icon: false }
			);
		}
	}
};

export default useHandleUserChangeSubmit;
