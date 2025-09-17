import { useEffect } from 'react';

const useHandleKeyUp = () => {
	useEffect(() => {
		let suggestionBoxWrapper = document.querySelector('#tracker-show-add-suggestions-container-wrapper');
		let trackedShowsBoxWrapper = document.querySelector('.tracker-tracked-shows-list-container-wrapper');
		let trackedShowListContainerWrapper = document.querySelector('.tracker-tracked-show-list-container-wrapper');
		const keyUpHandler = (e) => {
			if (e.code === 'ArrowLeft') {
				if (suggestionBoxWrapper.contains(document.activeElement)) {
					trackedShowListContainerWrapper.focus({ focusVisible: true });
				} else if (trackedShowsBoxWrapper.contains(document.activeElement)) {
					suggestionBoxWrapper.focus({ focusVisible: true });
				} else if (trackedShowListContainerWrapper.contains(document.activeElement)) {
					trackedShowsBoxWrapper.focus({ focusVisible: true });
				}
			} else if (e.code === 'ArrowRight') {
				if (suggestionBoxWrapper.contains(document.activeElement)) {
					trackedShowsBoxWrapper.focus({ focusVisible: true });
				} else if (trackedShowsBoxWrapper.contains(document.activeElement)) {
					trackedShowListContainerWrapper.focus({ focusVisible: true });
				} else if (trackedShowListContainerWrapper.contains(document.activeElement)) {
					suggestionBoxWrapper.focus({ focusVisible: true });
				}
			}
		};
		document.addEventListener('keyup', keyUpHandler);
		return () => {
			document.removeEventListener('keyup', keyUpHandler);
		};
	}, []);
};

export default useHandleKeyUp;
