const useHandleUserChange = (name, e, user, setUser) => {
	setUser({ ...user, [name]: e.target.value });
};

export default useHandleUserChange;
