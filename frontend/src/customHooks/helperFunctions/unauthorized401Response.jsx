import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Toast from '../../components/Toast.jsx';

const unauthorized401Response = (
	navigate,
	message = 'Your session has expired. Please log back in to resume tracking shows.',
	icon = '⚠️'
) => {
	toast.error(
		<Toast
			icon={icon}
			messageParagraph={message}
		/>,
		{
			icon: false,
			id: 'loginRedirect'
		}
	);
	navigate('/login');
};

export default unauthorized401Response;
