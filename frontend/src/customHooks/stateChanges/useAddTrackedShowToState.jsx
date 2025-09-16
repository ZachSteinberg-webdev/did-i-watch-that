const useAddTrackedShowToState = (setTrackedShows, newTrackedShow) => {
  setTrackedShows(() => {
    return [...newTrackedShow];
  });
};

export default useAddTrackedShowToState;
