const toggleEpisodeWatchedClassList = (targetArray) => {
  targetArray.forEach((target, i) => {
    if (target.classList.contains("unwatched")) {
      target.classList.remove("unwatched");
      target.classList.add("watched");
    } else {
      target.classList.remove("watched");
      target.classList.add("unwatched");
    }
  });
};

export default toggleEpisodeWatchedClassList;
