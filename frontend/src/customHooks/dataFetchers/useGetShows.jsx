const useGetShows = (setTrackedShows) => {
	const guestMode = JSON.parse(localStorage.getItem('guestMode') || 'false');
	if (guestMode) {
		try {
			const raw = localStorage.getItem('guestTrackedShows');
			const shows = raw ? JSON.parse(raw) : [];
			setTrackedShows(shows);
		} catch (err) {
			console.log('Guest getShows parse error', err);
			setTrackedShows([]);
		}
		return;
	}
	fetch('/api/getShows')
		.then((res) => res.json())
		.then((result) => {
			if (result.showsList.length > 0) {
				setTrackedShows(result.showsList[0].shows);
			} else {
				setTrackedShows([]);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

export default useGetShows;
