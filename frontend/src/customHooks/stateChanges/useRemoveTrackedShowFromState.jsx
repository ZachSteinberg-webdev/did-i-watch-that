const useRemoveTrackedShowFromState = (setTrackedShows, oldTrackedShow, showId) => {
	setTrackedShows(() => {
		return oldTrackedShow.filter((show) => show._id !== showId);
	});
};

export default useRemoveTrackedShowFromState;
