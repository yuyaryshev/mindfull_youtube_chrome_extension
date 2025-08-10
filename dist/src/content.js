(() => {
  // build/content.js
  console.log(`CODE00000000 version 001`);
  var y = window.y = document.y = {};
  setInterval(() => {
    window.y = document.y = y;
  }, 300);
  console.log(`CODE00000000 y`, window.y);
  console.log(`CODE00000000 y`, document.y);
  var MINDFULL_YT_KEY = "__mindfull_youtube";
  var y_hidden_elements = y.hidden_elements = new Set();
  function printHiddenWithSelectors() {
    console.log(`CODE00000000 All hidden elements:`, y_hidden_elements);
    for (let element of y_hidden_elements) {
      console.log(`CODE00000000 Hidden element: `, element[MINDFULL_YT_KEY].cpl, element[MINDFULL_YT_KEY].selector, element);
    }
  }
  setTimeout(printHiddenWithSelectors, 8e3);
  hideEvilElements();
  window.addEventListener("focus", hideEvilElements);
  setInterval(hideEvilElements, 300);
  function yRemove(a, opts = {}) {
    if (typeof a === "string") {
      a = document.querySelectorAll(a);
    }
    let itemsLeft = 0;
    if (!a) {
      return;
    }
    if (a.forEach) {
      let keepFirst = opts.keepFirst || 0;
      for (let elem of a) {
        if (keepFirst-- > 0) {
          itemsLeft++;
          continue;
        }
        if (elem.remove) {
          elem.remove();
        }
      }
    } else if (a.remove) {
      a.remove();
    }
    return {itemsLeft};
  }
  function yHideElementInternal(element) {
    var _a;
    const v_hidden = !!((_a = element[MINDFULL_YT_KEY]) === null || _a === void 0 ? void 0 : _a.keepFirstVisible);
    if (v_hidden) {
      element.hidden = true;
      if (element.style) {
        element.style.display = "none";
      }
      y_hidden_elements.add(element);
    }
    exportY(element);
  }
  function yHide(cpl, cssSelectorOrElement, keepFirstVisible) {
    let firstFound = false;
    if (typeof cssSelectorOrElement === "string") {
      for (let element of document.querySelectorAll(cssSelectorOrElement)) {
        if (!element[MINDFULL_YT_KEY]) {
          element[MINDFULL_YT_KEY] = {keepFirstVisible: !firstFound, selector: cssSelectorOrElement, cpl};
          firstFound = true;
        }
        yHideElementInternal(element);
      }
    } else if (!cssSelectorOrElement) {
      return;
    } else {
      const element = cssSelectorOrElement;
      if (!element[MINDFULL_YT_KEY]) {
        element[MINDFULL_YT_KEY] = {
          selector: cssSelectorOrElement,
          cpl
        };
      }
      yHideElementInternal(element);
    }
  }
  var consoleLogsLeft = 50;
  function switchYoutubeMusicToAudio() {
    const playerElement = document.querySelector("ytmusic-player");
    if (playerElement) {
      if (playerElement.id === "player" && playerElement.getAttribute("playback-mode") === "OMV_PREFERRED") {
        playerElement.setAttribute("playback-mode", "ATV_PREFERRED");
        console.log("Playback mode switched to ATV_PREFERRED.");
      }
    }
  }
  var exportY_done = false;
  function exportY(element0) {
    if (exportY_done) {
      return;
    }
    let element = element0;
    while (element.parentElement) {
      element = element.parentElement;
    }
    if (!element.y) {
      element.y = y;
      exportY_done = true;
      console.log(`CODE00000000 exportY_done`, element);
    }
  }
  function hideEvilElements() {
    const isOnMainPage = document.location.href.endsWith(".com/");
    const visibleElements = {
      nextVideos: false,
      mainPageVideos: false,
      subscriptionVideosRightPane: false,
      navigationPage: false,
      shortsAll: true,
      shortsNext: false,
      visibleElements: false,
      yourVideos: false,
      nextComments: false,
      other: false
    };
    const forbiddenUrls = {
      "youtube.com/feed/explore": visibleElements.navigationPage
    };
    const forbiddenSelectors = {
      ".ytp-endscreen-content": visibleElements.nextVideos,
      ".ytd-watch-flexy#secondary": visibleElements.nextVideos,
      '[href="/feed/explore"]': visibleElements.navigationPage
    };
    const forbiddenSidebarItems = {
      ["\u0412\u0430\u0448\u0438 \u0432\u0438\u0434\u0435\u043E"]: visibleElements.yourVideos,
      ["\u041D\u0430\u0432\u0438\u0433\u0430\u0442\u043E\u0440"]: visibleElements.navigationPage,
      ["\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0438"]: visibleElements.subscriptionVideosRightPane,
      ["Shorts"]: visibleElements.shortsAll,
      ["\u0422\u0432\u043E\u0440\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u0443\u0434\u0438\u044F"]: visibleElements.other,
      ["YouTube TV"]: visibleElements.other,
      ["\u0412\u0438\u0434\u0435\u043E\u0438\u0433\u0440\u044B"]: visibleElements.other,
      ["\u0422\u0440\u0430\u043D\u0441\u043B\u044F\u0446\u0438\u0438"]: visibleElements.other,
      ["\u0421\u043F\u043E\u0440\u0442"]: visibleElements.other,
      ["\u0418\u0433\u0440\u044B"]: visibleElements.other,
      ["\u0424\u0438\u043B\u044C\u043C\u044B"]: visibleElements.other,
      ["\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"]: visibleElements.other
    };
    if (!document.location.href.includes("youtube.com")) {
      return;
    }
    switchYoutubeMusicToAudio();
    if (document.location.href.includes("music.youtube.com")) {
      return;
    }
    yHide("CODE00000001", "ytd-notification-topbar-button-renderer", false);
    yHide("CODE00000002", "ytd-mini-guide-renderer", false);
    const selectedTabElem = document.querySelector("[aria-selected=true]");
    const selectedTabName = selectedTabElem && selectedTabElem.innerText || "";
    let contentVisible = true;
    for (const forbiddenUrl in forbiddenUrls) {
      const doHide = !forbiddenUrls[forbiddenUrl];
      if (doHide && document.location.href.includes(forbiddenUrl) && document.body) {
        contentVisible = false;
      }
    }
    if (isOnMainPage && !visibleElements.mainPageVideos) {
      contentVisible = false;
    }
    let allSidebarItems = document.querySelectorAll("ytd-guide-entry-renderer");
    for (const forbiddenText in forbiddenSidebarItems) {
      if (!forbiddenSidebarItems[forbiddenText]) {
        for (const sideBarItem of allSidebarItems) {
          if (sideBarItem.innerText.includes(forbiddenText)) {
            yHide("CODE00000003", sideBarItem, false);
          }
        }
      }
    }
    for (const selector in forbiddenSelectors) {
      const doHide = !forbiddenUrls[selector];
      if (doHide) {
        yHide("CODE00000004", selector, false);
      }
    }
    const shortsContainer = document.querySelector("#page-manager > ytd-shorts");
    if (document.location.href.includes("/shorts/") && shortsContainer && !shortsContainer.hidden) {
      const firstShortVideo0 = shortsContainer.querySelector("div.ytd-shorts");
      if (firstShortVideo0) {
        const firstShortVideo = firstShortVideo0;
        const shortsDiv = document.createElement("div");
        shortsDiv.id = MINDFULL_YT_KEY + "_shorts";
        firstShortVideo.parentElement.removeChild(firstShortVideo);
        shortsContainer.parentElement.prepend(shortsDiv);
        shortsDiv.appendChild(firstShortVideo);
        yHideElementInternal(shortsContainer);
      }
    }
    let nextVideosR = false;
    let mainPageVideosR = false;
    if (!visibleElements.mainPageVideos) {
      if (isOnMainPage) {
        yHide("CODE00000006", "#contents");
      }
      mainPageVideosR = true;
    }
    let nextCommentsR = false;
    if (!visibleElements.nextComments) {
      const keepFirst = 3;
      let {itemsLeft} = yRemove("ytd-comment-thread-renderer", {keepFirst});
      if (itemsLeft >= keepFirst) {
        yRemove("#more-replies");
        yRemove("ytd-continuation-item-renderer");
      }
      nextCommentsR = true;
    }
    if (consoleLogsLeft-- > 0) {
    }
    if (!contentVisible) {
      yHide("CODE00000007", "#page-manager");
    }
  }
  function onVideoStart(e) {
    console.log("CODE00000000 onVideoStart", e);
    const fromUser = navigator.userActivation.isActive;
    console.log("CODE00000000 onVideoStart", {fromUser});
    if (!fromUser) {
      console.log("CODE00000000 Auto-play detected, pausing...");
      e.target.pause();
    }
  }
  function onVideoPaused() {
    console.log("CODE00000000 onVideoPaused");
  }
  function onVideoStopped() {
    console.log("CODE00000000 onVideoStopped");
  }
  function onVideoPlaying() {
    console.log("CODE00000000 onVideoPlaying");
  }
  function allVidePlayers() {
    return document.querySelectorAll("video.html5-main-video");
  }
  function pauseAllVideos() {
    for (let element of allVidePlayers()) {
      element === null || element === void 0 ? void 0 : element.pause();
    }
  }
  window.addEventListener("yt-navigate-finish", () => {
    console.log("CODE00000000 Navigation happened \u2014 pausing video");
    pauseAllVideos();
  });
  function attachToAllVideoPlayers() {
    for (let element of allVidePlayers()) {
      if (!element.addEventListener || element[MINDFULL_YT_KEY]) {
        continue;
      }
      element[MINDFULL_YT_KEY] = {};
      element.addEventListener("play", onVideoStart, {capture: true});
      element.addEventListener("pause", onVideoPaused, {capture: true});
      element.addEventListener("stop", onVideoStopped, {capture: true});
      element.addEventListener("playing", onVideoPlaying, {capture: true});
    }
  }
  setInterval(attachToAllVideoPlayers, 300);
  attachToAllVideoPlayers();
  pauseAllVideos();
  for (let i = 0; i < 20; i++) {
    setTimeout(pauseAllVideos, i * 300);
  }
})();
//# sourceMappingURL=content.js.map
