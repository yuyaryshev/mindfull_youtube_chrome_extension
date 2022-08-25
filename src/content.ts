hideEvilElements();

// re-check page everytime this page gets focus again
window.addEventListener("focus", hideEvilElements);
setInterval(hideEvilElements, 300);

function hideEvilElements() {
    function setElementVisibility(cssSelectorOrElement: string | Element | null, visible: boolean) {
        const element: Element | null =
            typeof cssSelectorOrElement === "string" ? document.querySelector(cssSelectorOrElement) : cssSelectorOrElement;
        if (element) {
            (element as HTMLElement).hidden = !visible;
        }
    }

    const visibleElements = {
        nextVideos: false,
        mainPageVideos: false,
        subscriptionVideosRightPane: false,
        navigationPage: false,
        shorts: false,
        visibleElements: false,
        yourVideos: false,
        other: false,
    };

    const forbiddenUrls = {
        "youtube.com/shorts/": visibleElements.shorts,
        "youtube.com/feed/explore": visibleElements.navigationPage,
    };

    const forbiddenSelectors = {
        ".ytp-endscreen-content": visibleElements.nextVideos,
        ".ytd-watch-flexy#secondary": visibleElements.nextVideos,
        '[href="/feed/explore"]': visibleElements.navigationPage,
        '[Title="Shorts"]': visibleElements.shorts,
        // '[Title="Ваши видео"]':visibleElements.shorts,
    };

    const forbiddenTabs = {
        ["Главная"]: visibleElements.mainPageVideos,
    };

    const forbiddenSidebarItems = {
        ["Ваши видео"]: visibleElements.yourVideos,
        ["Навигатор"]: visibleElements.navigationPage,
        ["Подписки"]: visibleElements.subscriptionVideosRightPane,
        ["Shorts"]: visibleElements.shorts,
        ["Творческая студия"]: visibleElements.other,
        ["YouTube TV"]: visibleElements.other,
        ["Видеоигры"]: visibleElements.other,
        ["Трансляции"]: visibleElements.other,
        ["Спорт"]: visibleElements.other,
        ["Игры"]: visibleElements.other,
        ["Фильмы"]: visibleElements.other,
        ["Библиотека"]: visibleElements.other,
    };

    if (!document.location.href.includes("youtube.com") || document.location.href.includes("music.youtube.com")) {
        return;
    }

    // Hide notifications
    setElementVisibility("ytd-notification-topbar-button-renderer", false);

    // Hide mini sidebar
    setElementVisibility("ytd-mini-guide-renderer", false);

    const selectedTabElem = document.querySelector("[aria-selected=true]") as HTMLElement | null;
    const selectedTabName = (selectedTabElem && selectedTabElem.innerText) || "";

    let contentVisible = true;

    if (selectedTabName === "") {
        contentVisible = false;
    }

    for (const forbiddenUrl in forbiddenUrls) {
        const doHide = !forbiddenUrls[forbiddenUrl];
        if (doHide && document.location.href.includes(forbiddenUrl) && document.body) {
            contentVisible = false;
        }
    }

    if (forbiddenTabs.hasOwnProperty(selectedTabName) && !forbiddenTabs[selectedTabName]) {
        contentVisible = false;
    }
    setContentVisibility(contentVisible);

    if (!contentVisible) {
        return;
    }

    let allSidebarItems = document.querySelectorAll("ytd-guide-entry-renderer") as any;
    for (const forbiddenText in forbiddenSidebarItems) {
        if (!forbiddenSidebarItems[forbiddenText]) {
            for (const sideBarItem of allSidebarItems) {
                if (sideBarItem.innerText.includes(forbiddenText)) {
                    setElementVisibility(sideBarItem, false);
                }
            }
        }
    }

    function setContentVisibility(visible) {
        setElementVisibility("#page-manager", visible);
        if (!visible) {
            // stopVideo();
        }
    }

    for (const selector in forbiddenSelectors) {
        const doHide = !forbiddenUrls[selector];

        if (doHide) {
            setElementVisibility(document.querySelector(selector), false);
        }
    }

    // Hide Shorts
    if (!visibleElements.shorts) {
        const allContentsElements = document.querySelectorAll("ytd-reel-shelf-renderer") as any;
        for (const element of allContentsElements) {
            for (const innerElem of element.querySelectorAll("span")) {
                if (innerElem.innerText === "Shorts") {
                    setElementVisibility(element, false);
                }
            }
        }
    }
}
