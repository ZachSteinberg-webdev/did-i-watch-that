import axios from "axios";
import makeAllInputAreasInert from "../helperFunctions/makeAllInputAreasInert.jsx";
import unauthorized401Response from "../helperFunctions/unauthorized401Response.jsx";
import { toast } from "react-hot-toast";

import useUpdateWatchedEpisodesState from "../stateChanges/useUpdateWatchedEpisodesState.jsx";

import Toast from "../../components/Toast.jsx";

const useHandleToggleSeasonWatched = async (
  e,
  user,
  trackedShow,
  setWatchedEpisodes,
  watchedEpisodes,
  navigate,
) => {
  e.preventDefault();
  makeAllInputAreasInert(true);

  const seasonObjectId = e.target[0].value;
  const guestMode = JSON.parse(localStorage.getItem("guestMode") || "false");

  try {
    if (guestMode) {
      const seasonLabel = e.target[0].innerText.replace("Season ", "");
      const seasonRow = document.getElementById(`season-row-${seasonLabel}`);
      const episodeForms = seasonRow?.querySelectorAll(
        "form.tracked-show-season-episode-container",
      );
      const seasonNumber = Number(seasonLabel);
      const watchedMapRaw = localStorage.getItem("guestWatchedEpisodes");
      const watchedMap = watchedMapRaw ? JSON.parse(watchedMapRaw) : {};
      const showKey = trackedShow.showId || trackedShow._id;
      let storedEpisodeIds = watchedMap[showKey] || [];
      const allEpisodeIds = [];
      const airedEpisodeIds = [];
      const now = new Date();

      if (episodeForms) {
        for (const form of episodeForms) {
          const val = form.querySelector("button").value;
          const obj = JSON.parse(val);
          allEpisodeIds.push(obj._id);
          const airstamp = new Date(obj.episodeAirstamp || obj.airstamp);
          if (airstamp < now) {
            airedEpisodeIds.push(obj._id);
          }
        }
      }

      const alreadyWatchedAll = allEpisodeIds.every((id) =>
        storedEpisodeIds.includes(id),
      );

      if (alreadyWatchedAll) {
        storedEpisodeIds = storedEpisodeIds.filter(
          (id) => !allEpisodeIds.includes(id),
        );
        watchedMap[showKey] = storedEpisodeIds;
        localStorage.setItem(
          "guestWatchedEpisodes",
          JSON.stringify(watchedMap),
        );
        useUpdateWatchedEpisodesState(
          setWatchedEpisodes,
          watchedEpisodes,
          allEpisodeIds,
          "unwatched",
        );
        const message = `All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as unwatched.`;
        toast.success(<Toast icon="👍" messageParagraph={message} />, {
          icon: false,
        });
      } else {
        const merged = Array.from(
          new Set([...storedEpisodeIds, ...airedEpisodeIds]),
        );
        watchedMap[showKey] = merged;
        localStorage.setItem(
          "guestWatchedEpisodes",
          JSON.stringify(watchedMap),
        );
        useUpdateWatchedEpisodesState(
          setWatchedEpisodes,
          watchedEpisodes,
          airedEpisodeIds,
          "watched",
        );
        const suffix =
          airedEpisodeIds.length < allEpisodeIds.length
            ? ", except those which have not aired yet"
            : "";
        const message = `All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as watched${suffix}.`;
        toast.success(<Toast icon="👍" messageParagraph={message} />, {
          icon: false,
        });
      }
    } else {
      const { data } = await axios.post("/api/toggleSeasonWatched", {
        user,
        seasonObjectId,
      });
      if (data.success === true) {
        const seasonNumber = data.season.seasonNumber;
        const seasonEpisodeObjectIdList = data.seasonEpisodeObjectIdList;
        if (seasonEpisodeObjectIdList.length === 0) {
          if (data.seasonPremiereDate === null) {
            const message = `Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet. A premiere date has not yet been released. Keep checking back periodically for updated information.`;
            toast.success(<Toast icon="🐴" messageParagraph={message} />, {
              icon: false,
            });
          } else {
            const message = `Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet. Season ${seasonNumber} will begin airing on ${new Date(data.seasonPremiereDate).toLocaleDateString()}. Stay tuned!`;
            toast.success(<Toast icon="🐴" messageParagraph={message} />, {
              icon: false,
            });
          }
        } else {
          const {
            watchedStatus,
            firstEpisodeOfSeasonNotAiredYet,
            firstEpisodeAirstamp,
            unwatchedEpisodes,
            episodesUpdatedToWatched,
          } = data;
          if (watchedStatus === "unwatched") {
            useUpdateWatchedEpisodesState(
              setWatchedEpisodes,
              watchedEpisodes,
              seasonEpisodeObjectIdList,
              watchedStatus,
            );
            const message = `All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}.`;
            toast.success(<Toast icon="👍" messageParagraph={message} />, {
              icon: false,
            });
          } else if (
            watchedStatus === "watched" &&
            episodesUpdatedToWatched.length === unwatchedEpisodes.length
          ) {
            useUpdateWatchedEpisodesState(
              setWatchedEpisodes,
              watchedEpisodes,
              episodesUpdatedToWatched,
              watchedStatus,
            );
            const message = `All unwatched episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}.`;
            toast.success(<Toast icon="👍" messageParagraph={message} />, {
              icon: false,
            });
          } else if (watchedStatus === "watched") {
            if (firstEpisodeOfSeasonNotAiredYet === false) {
              useUpdateWatchedEpisodesState(
                setWatchedEpisodes,
                watchedEpisodes,
                episodesUpdatedToWatched,
                watchedStatus,
              );
              const message = `All episodes from season ${seasonNumber} of ${trackedShow.showName} have been marked as ${watchedStatus}, except those which have not aired yet.`;
              toast.success(<Toast icon="👍" messageParagraph={message} />, {
                icon: false,
              });
            } else if (firstEpisodeOfSeasonNotAiredYet === true) {
              if (!firstEpisodeAirstamp) {
                const message = `Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} has not premiered yet.`;
                toast.success(<Toast icon="👍" messageParagraph={message} />, {
                  icon: false,
                });
              } else {
                const message = `Whoa there! Hold your horses! Season ${seasonNumber} of ${trackedShow.showName} doesn't premiere until ${new Date(data.season.seasonPremiereDate).toLocaleDateString()}.`;
                toast.success(<Toast icon="👍" messageParagraph={message} />, {
                  icon: false,
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.log(
        'Caught 401 "unauthorized" error from handleToggleSeasonWatched in frontend Tracker.jsx',
        err,
      );
      unauthorized401Response(navigate);
    } else {
      console.log(
        "Caught error from handleToggleSeasonWatched in frontend Tracker.jsx",
        err,
      );
      const message = "Something went wrong. :( Please try again later.";
      toast.error(<Toast icon="🙊" messageParagraph={message} />, {
        icon: false,
      });
    }
  } finally {
    makeAllInputAreasInert(false);
  }
};

export default useHandleToggleSeasonWatched;
