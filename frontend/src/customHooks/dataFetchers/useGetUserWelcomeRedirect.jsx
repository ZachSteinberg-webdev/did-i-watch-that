import {toast} from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useGetUserWelcomeRedirect=(
	navigate
)=>{
	fetch('/api/getUser')
	.then(res=>{
		return res.json()
	})
	.then(result=>{
		if(result.success===true){
			toast.success(<Toast icon='👋' messageParagraph='Welcome back!'/>, {icon: false, id: 'knownUserRedirect'});
			navigate('/tracker');
		};
	})
	.catch(err=>{
		console.log(err);
	});
};

export default useGetUserWelcomeRedirect;
