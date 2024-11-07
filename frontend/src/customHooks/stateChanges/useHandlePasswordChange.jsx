const useHandlePasswordChange=(
	name,
	e,
	password,
	setPassword
)=>{
	setPassword({...password, [name]: e.target.value});
};

export default useHandlePasswordChange;
