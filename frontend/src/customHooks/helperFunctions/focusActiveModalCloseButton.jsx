const focusActiveModalCloseButton = (button) => {
	setTimeout(() => {
		button.focus({ focusVisible: true });
	}, 1000);
};

export default focusActiveModalCloseButton;
