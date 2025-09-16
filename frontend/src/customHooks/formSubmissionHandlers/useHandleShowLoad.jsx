import axios from "axios";
import makeAllInputAreasInert from "../helperFunctions/makeAllInputAreasInert.jsx";
import unauthorized401Response from "../helperFunctions/unauthorized401Response.jsx";
import { toast } from "react-hot-toast";

import Toast from "../../components/Toast.jsx";

const useHandleShowLoad = async (
  e,
  trackedShow,
  setShowTrackedShowSpinner,
  setTrackedShowSeasons,
  setTrackedShow,
  user,
  setWatchedEpisodes,
  navigate,
) => {
  let trackedShowListContainer = document.querySelector(
    ".tracker-tracked-show-list-container",
  );
  e.preventDefault();
  const showObjectId = e.target[0].value;
  const currentlyTrackedShowObjectId = trackedShow._id;
  try {
    if (showObjectId === currentlyTrackedShowObjectId) {
      const message = `${trackedShow.showName} is currently loaded in the Show Tracker!`;
      toast.success(
        <Toast icon="🤦‍♂️" icon2="🤦‍♀️" messageParagraphTwoIcons={message} />,
        { icon: false },
      );
    } else {
      setShowTrackedShowSpinner(true);
      makeAllInputAreasInert(true);
      setTrackedShowSeasons([]);
      setTrackedShow({});
      const guestMode = JSON.parse(
        localStorage.getItem("guestMode") || "false",
      );
      if (guestMode) {
        // Find the show by TVMaze id
        const raw = localStorage.getItem("guestTrackedShows");
        const shows = raw ? JSON.parse(raw) : [];
        const show = shows.find((s) => String(s._id) === String(showObjectId));
        if (!show) {
          throw new Error("Show not found in guest list");
        }
        await setTrackedShow(show);
        // Fetch seasons and episodes from TVMaze
        const seasonsRes = await axios.get(
          `https://api.tvmaze.com/shows/${show.showId}/seasons`,
        );
        const seasonsData = seasonsRes.data;
        const seasons = [];
        for (const season of seasonsData) {
          const epRes = await axios.get(
            `https://api.tvmaze.com/seasons/${season.id}/episodes`,
          );
          const episodesData = epRes.data;
          const episodeObjectIds = episodesData.map((ep) => ({
            _id: ep.id,
            seasonNumber: ep.season,
            episodeNumber: ep.number,
            episodeId: ep.id,
            episodeTitle: ep.name,
            episodeType: ep.type,
            episodeAirdate: ep.airdate,
            episodeAirtime: ep.airtime,
            episodeAirstamp: ep.airstamp,
            episodeRuntime: ep.runtime,
            episodeRating: ep.rating?.average,
            episodeSummaryHtml: ep.summary,
            episodeImageLink: ep.image && ep.image.original,
            showName: show.showName,
          }));
          seasons.push({
            _id: season.id,
            seasonNumber: season.number,
            seasonId: season.id,
            seasonName: season.name,
            seasonEpisodeOrder: season.episodeOrder,
            seasonPremiereDate: season.premiereDate,
            seasonEndDate: season.endDate,
            episodeObjectIds,
          });
        }
        await setTrackedShowSeasons(seasons);
        // Load watched episodes for this show from localStorage
        const watchedMapRaw = localStorage.getItem("guestWatchedEpisodes");
        const watchedMap = watchedMapRaw ? JSON.parse(watchedMapRaw) : {};
        const epArray = watchedMap[show.showId] || [];
        setWatchedEpisodes(epArray);
      } else {
        const data = await axios.post("/api/loadShow", { user, showObjectId });
        if (data.data.success === true) {
          const newTrackedShow = data.data.show;
          await setTrackedShow(newTrackedShow);
          const newTrackedShowSeasons = data.data.seasons;
          await setTrackedShowSeasons(newTrackedShowSeasons);
          const usersWatchedEpisodes = [];
          for (let season of newTrackedShowSeasons) {
            let episodes = season.episodeObjectIds;
            for (let episode of episodes) {
              if (episode.usersWhoHaveWatched.includes(user._id)) {
                usersWatchedEpisodes.push(episode._id);
              }
            }
          }
          setWatchedEpisodes(usersWatchedEpisodes);
        }
        setTimeout(() => {
          trackedShowListContainer.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }, 200);
      }
    }
  } catch (err) {
    if (err.response.status && err.response.status === 401) {
      console.log(
        'Caught 401 "unauthorized" error from handleToggleEpisodeWatched in frontend Tracker.jsx',
        err,
      );
      setShowTrackedShowSpinner(false);
      makeAllInputAreasInert(false);
      unauthorized401Response(navigate);
    } else {
      console.log(
        "Caught error from handleShowLoad in frontend Tracker.jsx",
        err,
      );
      const message = "Something went wrong. :( Please try again later.";
      toast.error(<Toast icon="🙊" messageParagraph={message} />, {
        icon: false,
      });
    }
  }
  setShowTrackedShowSpinner(false);
  makeAllInputAreasInert(false);
  setTimeout(() => {
    trackedShowListContainer.focus({ focusVisible: true });
  }, 50);
};

export default useHandleShowLoad;
