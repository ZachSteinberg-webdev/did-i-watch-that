const useHandleShowChange = (setShow) => {
	const handleShowChange = (e) => {
		setShow(e.target.value);
	};
	return handleShowChange;
};

export default useHandleShowChange;
