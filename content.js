// alert("hello");
//document.body.style.background = 'yellow';

function hideEvilElements() {
	if(!document.location.href.includes('youtube.com') || document.location.href.includes('music.youtube.com')) {
		return;
	}

	const visibleElements = {
		nextVideos: false,
		mainPageVideos: false,
		subscriptionVideosRightPane: false,
		navigationPage: false,
		shorts : false,
		visibleElements:false,
	}

	const forbiddenUrls = {
		'youtube.com/shorts/':visibleElements.shorts,
	}

	const forbiddenSelectors = {
		'.ytp-endscreen-content':visibleElements.nextVideos,
		'.ytd-watch-flexy#secondary':visibleElements.nextVideos,
		'[href="/feed/explore"]':visibleElements.navigationPage,
		'[Title="Shorts"]':visibleElements.shorts,
		// '[Title="Ваши видео"]':visibleElements.shorts,
	}

	const forbiddenTabs = {
		'Главная':visibleElements.mainPageVideos,
	}

	const forbiddenSidebarItems = {
		'Ваши видео':visibleElements.yourVideos,
		'Навигатор':visibleElements.navigationPage,
		'Подписки':visibleElements.subscriptionVideosRightPane,
		'Shorts':visibleElements.shorts,
		'Творческая студия':visibleElements.other,
		'YouTube TV':visibleElements.other,
		'Видеоигры':visibleElements.other,
		'Трансляции':visibleElements.other,
		'Спорт':visibleElements.other,
		'Игры':visibleElements.other,
		'Фильмы':visibleElements.other,
		'Библиотека':visibleElements.other,
	}

	// Hide notifications
	document.querySelector('ytd-notification-topbar-button-renderer').hidden=true;

	// Hide mini sidebar
	document.querySelector('ytd-mini-guide-renderer').hidden=true;

	const selectedTabElem = document.querySelector('[aria-selected=true]');
	const selectedTabName = selectedTabElem && selectedTabElem.innerText || '';

	let contentVisible = true;

	if(selectedTabName === '') {
		contentVisible = false;
	}

	for(const forbiddenUrl in forbiddenUrls) {
		const doHide = !forbiddenUrls[forbiddenUrl];
		if(doHide && document.location.href.includes(forbiddenUrl) && document.body) {
			contentVisible = false;
		}
	}

	if(forbiddenTabs.hasOwnProperty(selectedTabName) && !forbiddenTabs[selectedTabName]){
		contentVisible = false;
	}
	setContentVisibility(contentVisible);

	if(!contentVisible) {
		return;
	}

	let allSidebarItems = document.querySelectorAll('ytd-guide-entry-renderer');
	for(const forbiddenText in forbiddenSidebarItems) {
		if(!forbiddenSidebarItems[forbiddenText]){
			for(const sideBarItem of allSidebarItems) {
				if(sideBarItem.innerText.includes(forbiddenText)) {
					sideBarItem.hidden = true;
				}
			}
		}
	}

	function hideElement(elements) {
		if(elements) {
			// elements.innerHTML = `<div>Mindfull youtube</div>`
			elements.hidden = true;
		}
	}

	function setContentVisibility(visible) {
		document.getElementById('page-manager').hidden = !visible;
		if(!visible) {
			// stopVideo();
		}
	}

	for(const selector in forbiddenSelectors) {
		const doHide = !forbiddenUrls[selector];

		if(doHide) {
			hideElement(document.querySelector(selector));
		}
	}

	// Hide Shorts
	if(!visibleElements.shorts) {
		const allContentsElements = document.querySelectorAll('ytd-reel-shelf-renderer');
		for(const element of allContentsElements) {
			for(const innerElem of element.querySelectorAll('span')) {
				if(innerElem.innerText === 'Shorts') {
					element.hidden = true;
				}
			}
		}
	}
}
hideEvilElements();
setInterval(hideEvilElements, 300);

console.log(`mindfull_youtube_chrome_extension - content.js started!`)
