import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/LearnMore.css';

import useGetInitialDarkModePreference from '../customHooks/dataFetchers/useGetInitialDarkModePreference.jsx';

import Footer from '../components/Footer.jsx';

export default function LearnMore() {
	useEffect(() => {
		useGetInitialDarkModePreference();
	}, []);
	return (
		<>
			<div id='learn-more-page'>
				<div className='learn-more-header'>
					<h1 className='learn-more-header-text'>&#x1F914; Did I Watch That?!?! &#x1F9D0;</h1>
					<img
						className='learn-more-header-img'
						src='television_1f4fa-with-exclamation-question-mark.png'
					/>
				</div>
				<div className='learn-more-subheader'>
					<p className='learn-more-subheader-text'>
						Keep track of the TV shows you've watched. Never find yourself wondering which season or episode you last
						watched.
					</p>
				</div>
				<div className='learn-more-text-container'>
					<div className='learn-more-text'>
						Have you ever sat down to watch a TV show but you can't remember where you left off? You know you were in
						season 3 of that killer comedy or edge-of-your-seat drama, but you aren't sure which episode you last
						watched. Then you take a guess and launch a random episode. Nope! That's not it. You've already seen that
						one. Or worse, you get an unwanted preview of an episode you haven't watched yet. Spoiler alert! Well,
						search no more. Simply keep Did I Watch That?!?! open on your phone, tablet or computer when you watch TV
						shows, and mark each episode off as you watch it. Never guess again!
					</div>
					<hr className='learn-more-text-hr' />
					<div className='learn-more-text'>
						Using Did I Watch That?!?! is as simple as searching for your show in the app, adding it to your list of
						tracked shows, then loading it into the show tracker when you watch, and clicking or tapping the button for
						a given episode once you've watched it. It's all done on one page. No jumping around from page to page or
						searching for what you need when you need it. Just sit back, relax and enjoy your show with your new helper
						along for the ride!
					</div>
					<div className='learn-more-text-small'>
						Have you ever sat down to watch a TV show but you can't remember where you left off? What a pain! Did I
						Watch That?!?! helps you keep track of which episodes of a show you've watched. Simply keep Did I Watch
						That?!?! open when you watch and mark each episode as you watch it. Never guess again!
					</div>
					<div className='learn-more-text-small'>
						It's as simple as searching for a show, adding it to your tracked shows list, loading it into the tracker,
						and clicking the button for an episode once you've watched it. All on one page. No jumping around or
						searching for what you need. Just sit back, relax and enjoy your show with your new helper along for the
						ride!
					</div>
					<div className='learn-more-text-extra-small'>
						Have you ever sat down to watch a TV show but you can't remember where you left off? Did I Watch That?!?!
						helps you keep track of episodes you've watched. Keep it open when you watch and mark each episode as you
						watch it. Never guess again!
					</div>
					<div className='learn-more-text-extra-small'>
						It's as simple as searching for a show, adding it to your shows list, loading it into the tracker and
						clicking on an episode once you've watched it. All on one page. Just sit back, relax and enjoy your show
						with your new helper along for the ride!
					</div>
				</div>
				<div className='learn-more-buttons'>
					<Link
						to='/login'
						tabIndex='-1'
					>
						<button
							className='learn-more-button'
							id='learn-more-log-in'
						>
							Log in
						</button>
					</Link>
					<Link
						to='/register'
						tabIndex='-1'
					>
						<button
							className='learn-more-button'
							id='learn-more-register'
						>
							Register
						</button>
					</Link>
				</div>
			</div>
			<Footer />
		</>
	);
}
