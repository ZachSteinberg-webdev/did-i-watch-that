const useUpdateWatchedEpisodesState=async(
	setWatchedEpisodes,
	oldWatchedEpisodes,
	episodeObjectIdArray,
	watchedStatus
)=>{
	if(episodeObjectIdArray.length===1){
		for(let episodeObjectId of episodeObjectIdArray){
			if(oldWatchedEpisodes.includes(episodeObjectId)){
				setWatchedEpisodes(()=>{
					const newWatchedEpisodesState = oldWatchedEpisodes.filter(episode=>episode!==episodeObjectId);
					return newWatchedEpisodesState;
				});
			}else{
				setWatchedEpisodes(()=>{
					oldWatchedEpisodes.push(episodeObjectId);
					return [...oldWatchedEpisodes];
				});
			};
		};
	}else{
		if(episodeObjectIdArray.length>1){
			if(watchedStatus==='watched'){
				for(let episodeObjectId of episodeObjectIdArray){
					if(!oldWatchedEpisodes.includes(episodeObjectId)){
						oldWatchedEpisodes.push(episodeObjectId);
					};
				};
				await setWatchedEpisodes(()=>{
					return [...oldWatchedEpisodes];
				});
			}else if(watchedStatus==='unwatched'){
				const newWatchedEpisodesState = oldWatchedEpisodes.filter(episodeObjectId=>!episodeObjectIdArray.includes(episodeObjectId));
				await setWatchedEpisodes(()=>{
					return newWatchedEpisodesState;
				});
			};
		};
	};
};

export default useUpdateWatchedEpisodesState;
