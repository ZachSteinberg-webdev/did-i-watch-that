import {toast} from 'react-hot-toast';

import Toast from '../../components/Toast.jsx';

const useGetUser=(
	setUser,
	navigate
)=>{
	fetch('/api/getUser')
	.then(res=>{
		return res.json()
	})
	.then(result=>{
		if(result.success===true){
			setUser(result.user);
		}else{
			toast.error(<Toast icon='⚠️' messageParagraph='You must be logged in to view that page.'/>, {icon: false, id: 'loginRedirect'});
			navigate('/login');
		};
	})
	.catch(err=>{
		console.log(err);
	});
};

export default useGetUser;
