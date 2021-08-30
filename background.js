function reddenPage() {
  let nextVideosVisible = false;
	function setNextVideosVisibility(new_nextVideosVisible) {
		//console.log('setNextVideosVisibility - started', nextVideosVisible);
		if(new_nextVideosVisible!== undefined) {
			nextVideosVisible = new_nextVideosVisible;
		}
		let c1 = document.querySelector('.ytd-watch-flexy#secondary')
		if(c1) {
			c1.hidden = !nextVideosVisible;	
		}
		
		let c2 = document.querySelector('.ytp-endscreen-content');	
		if(c2) {
			c2.hidden = !nextVideosVisible;	
		}
		// console.log('setNextVideosVisibility - done');
	}
	setNextVideosVisibility(false);
	setInterval(setNextVideosVisibility, 300);

  
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage
  });
});

console.log(`mindfull_youtube_chrome_extension - background.js started!\n typeof chrome.action.onClicked.addListener = ${typeof chrome.action.onClicked.addListener}`)
