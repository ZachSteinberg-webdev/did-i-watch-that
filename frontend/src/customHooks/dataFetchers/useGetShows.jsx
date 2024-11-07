const useGetShows=(
	setTrackedShows
)=>{
	fetch('/api/getShows')
	.then(res=>{
		return res.json()
	})
	.then(result=>{
		if(result.showsList.length>0){
			setTrackedShows(result.showsList[0].shows);
		}else{
			const shows=[];
			setTrackedShows(shows);
		};
	})
	.catch(err=>{
		console.log(err);
	});
};

export default useGetShows;
