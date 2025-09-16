const makeAllInputAreasInert = (boolean) => {
  let trackerShowAddForm = document.querySelector("#tracker-show-add-form");
  let suggestionBoxWrapper = document.querySelector(
    "#tracker-show-add-suggestions-container-wrapper",
  );
  let trackedShowsListSortForm = document.querySelector(
    ".tracker-tracked-shows-list-sort-form",
  );
  let trackedShowsBoxWrapper = document.querySelector(
    ".tracker-tracked-shows-list-container-wrapper",
  );
  let trackedShowListContainerWrapper = document.querySelector(
    ".tracker-tracked-show-list-container-wrapper",
  );
  if (boolean === true) {
    trackerShowAddForm.inert = true;
    suggestionBoxWrapper.inert = true;
    trackedShowsListSortForm.inert = true;
    trackedShowsBoxWrapper.inert = true;
    trackedShowListContainerWrapper.inert = true;
  } else if (boolean === false) {
    trackerShowAddForm.inert = false;
    suggestionBoxWrapper.inert = false;
    trackedShowsListSortForm.inert = false;
    trackedShowsBoxWrapper.inert = false;
    trackedShowListContainerWrapper.inert = false;
  }
};

export default makeAllInputAreasInert;
