function reddenPage() {
  document.body.style.backgroundColor = 'red';
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage
  });
});

console.log(`mindfull_youtube_chrome_extension - background.js started!\n typeof chrome.action.onClicked.addListener = ${typeof chrome.action.onClicked.addListener}`)
